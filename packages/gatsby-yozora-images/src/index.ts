import type { AstMutateApi } from '@guanghechen/gatsby-transformer-yozora'
import type { YastAlternative, YastNode, YastResource } from '@yozora/ast'
import { DefinitionType, ImageType } from '@yozora/ast'
import chalk from 'chalk'
import { slash } from 'gatsby-core-utils'
import { fluid } from 'gatsby-plugin-sharp'
import path from 'path'
import { EMPTY_ALT } from './constant'
import type { GatsbyYozoraImagesOptions, ResolvedImageData } from './types'
import { getImageInfo, isRelativeUrl, traverseYozoraAST } from './util'

type ImageNode = YastNode & YastResource & YastAlternative

async function mutateYozoraAst(
  { files, cache, markdownNode, markdownAST, reporter, getNode }: AstMutateApi,
  options: GatsbyYozoraImagesOptions,
): Promise<unknown> {
  // Takes a node and generates the needed images and then returns
  // the needed HTML replacement for the image
  const generateImagesAndUpdateNode = async function (
    node: ImageNode,
    overWrites: Record<string, unknown> = {},
  ): Promise<ResolvedImageData | null> {
    // Check if this markdownNode has a File parent. This plugin
    // won't work if the image isn't hosted locally.
    if (markdownNode.parent == null) return null
    const parentNode = getNode(markdownNode.parent)
    if (parentNode == null || parentNode.dir == null) return null

    const imagePath: string = slash(
      path.join(parentNode.dir as string, getImageInfo(node.url).url),
    )
    const imageNode = files.find(
      file => file != null && file.absolutePath === imagePath,
    )
    if (imageNode == null || imageNode.absolutePath == null) return null

    const fluidResult = await fluid({
      file: imageNode,
      args: options,
      reporter,
      cache,
    })

    if (!fluidResult) return null

    // Generate default alt tag
    const srcSplit = getImageInfo(node.url).url.split(`/`)
    const fileName = srcSplit[srcSplit.length - 1]
    const fileNameNoExt = fileName.replace(/\.[^/.]+$/, ``)
    const defaultAlt = fileNameNoExt.replace(/[^A-Z0-9]/gi, ` `)
    const isEmptyAlt = node.alt === EMPTY_ALT
    const alt = isEmptyAlt ? '' : overWrites.alt ?? node.alt ?? defaultAlt
    const title = node.title ?? alt

    const loading = options.loading ?? 'lazy'
    if (![`lazy`, `eager`, `auto`].includes(loading)) {
      reporter.warn(
        reporter.stripIndent(`
        ${chalk.bold(loading)} is an invalid value for the ${chalk.bold(
          `loading`,
        )} option. Please pass one of "lazy", "eager" or "auto".
      `),
      )
    }

    return {
      alt: alt as string,
      title: title as string,
      src: fluidResult.src,
      srcset: fluidResult.srcSet,
      sizes: fluidResult.sizes,
      loading,
    }
  }

  const markdownImageNodes: ImageNode[] = []
  traverseYozoraAST(
    markdownAST,
    (node: YastNode) => markdownImageNodes.push(node as ImageNode),
    [DefinitionType, ImageType],
  )

  const results: Array<Promise<YastNode | null>> = []
  for (const node of markdownImageNodes) {
    const overWrites = {}
    const fileType = getImageInfo(node.url).ext
    // Ignore gifs as we can't process them,
    // svgs as they are already responsive by definition
    if (isRelativeUrl(node.url) && fileType !== `gif` && fileType !== `svg`) {
      results.push(
        generateImagesAndUpdateNode(node, overWrites).then(imageData => {
          if (imageData == null) return null
          node.url = imageData.src
          return node
        }),
      )
    }
  }

  return await Promise.all(results).then(nodes => nodes.filter(Boolean))
}

export default mutateYozoraAst

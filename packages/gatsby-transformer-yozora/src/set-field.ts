import { isFunction } from '@guanghechen/option-helper'
import type {
  HeadingToc,
  Root,
  YastLiteral,
  YastNode,
  YastParent,
  YastResource,
} from '@yozora/ast'
import { DefinitionType, ImageType, LinkType } from '@yozora/ast'
import { calcHeadingToc, shallowCloneAst, traverseAST } from '@yozora/ast-util'
import type { Node, SetFieldsOnGraphQLNodeTypeArgs } from 'gatsby'
import type { TransformerYozoraOptions } from './types'
import { isEnvProduction } from './util/env'
import { normalizeTagOrCategory } from './util/string'
import { resolveUrl } from './util/url'

let fileNodes: Node[] | null = null
const astPromiseMap = new Map<string, Promise<Root>>()

/**
 * Gatsby hook.
 *
 * Set customized graphql fields.
 *
 * @param api
 * @param options
 */
export async function setFieldsOnGraphQLNodeType(
  api: SetFieldsOnGraphQLNodeTypeArgs,
  options: TransformerYozoraOptions,
): Promise<any> {
  const { slugField = 'slug' } = options.frontmatter || {}
  const urlPrefix: string = resolveUrl(api.pathPrefix, api.basePath as string)
  const { parser } = options

  /**
   * Parse markdown contents & resolve url references.
   *
   * @param content
   * @param options
   * @param basePath
   * @returns
   */
  function parseMarkdown(
    content: string,
    resolveUrl?: (url: string) => string,
  ): Root {
    const ast = parser.parse(content)

    // Correct url paths.
    if (resolveUrl != null) {
      traverseAST(ast, [DefinitionType, LinkType, ImageType], node => {
        const o = node as YastNode & YastResource
        if (o.url != null) o.url = resolveUrl(o.url)
      })

      for (const definition of Object.values(ast.meta.definitions)) {
        definition.url = resolveUrl(definition.url)
      }
    }

    return ast
  }

  /**
   * Calc Yast Root from markdownNode.
   *
   * @param markdownNode
   * @returns
   */
  async function getAst(markdownNode: Node): Promise<Root> {
    const cacheKey =
      'transformer-yozora-markdown-ast:' + markdownNode.internal.contentDigest

    // Check from cache.
    const cachedAST = await api.cache.get(cacheKey)
    if (cachedAST != null) return cachedAST

    // Check from promise cache.
    const promise = astPromiseMap.get(cacheKey)
    if (promise != null) return await promise

    // Get all file nodes.
    if (!isEnvProduction || fileNodes == null) {
      fileNodes = api.getNodesByType('File')
    }

    // Execute hooks to mutate source contents before parse processing.
    const plugins = options.plugins || []
    for (const plugin of plugins) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const requiredPlugin = require(plugin.resolve)
      if (isFunction(requiredPlugin.mutateSource)) {
        await requiredPlugin.mutateSource(
          {
            ...api,
            markdownNode,
            files: fileNodes,
            urlPrefix,
            cache: (api.getCache as any)(plugin.name ?? plugin.resolve),
          },
          plugin.options,
        )
      }
    }

    const slug: string = (markdownNode as any).frontmatter[slugField] ?? ''
    const astPromise: Promise<Root> = (async function (): Promise<Root> {
      const ast: Root = parseMarkdown(
        markdownNode.internal.content || '',
        url => {
          if (/^[/](?![/])/.test(url)) return resolveUrl(urlPrefix, slug, url)
          return url
        },
      )

      // Execute hooks to mutate ast.
      const plugins = options.plugins ?? []
      for (const plugin of plugins) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const requiredPlugin = require(plugin.resolve)

        // Allow both exports = function(), and exports.default = function()
        const defaultFunction = isFunction(requiredPlugin)
          ? requiredPlugin
          : isFunction(requiredPlugin.default)
          ? requiredPlugin.default
          : undefined

        if (defaultFunction) {
          await defaultFunction(
            {
              ...api,
              markdownAST: ast,
              markdownNode,
              files: fileNodes,
              urlPrefix,
              cache: (api.getCache as any)(plugin.name ?? plugin.resolve),
            },
            plugin.options,
          )
        }
      }
      return ast
    })()
    astPromiseMap.set(cacheKey, astPromise)

    try {
      const ast = await astPromise
      await api.cache.set(cacheKey, ast)
      return ast
    } finally {
      astPromiseMap.delete(cacheKey)
    }
  }

  /**
   * Calc Yozora Markdown AST of excerpt content.
   * @param fullAst
   * @param param1
   * @returns
   */
  async function getExcerptAst(
    fullAst: Root,
    { pruneLength, excerptSeparator }: GetExcerptAstOptions,
  ): Promise<Root> {
    if (excerptSeparator != null) {
      const separator = excerptSeparator.trim()
      return shallowCloneAst(fullAst, node => {
        const { value } = node as YastLiteral
        return value != null && value.trim() === separator
      })
    }

    if (fullAst.children.length <= 0) return fullAst

    // Try to truncate excerpt.
    let totalExcerptLengthSoFar = 0
    let parentOfLastLiteralNode: YastParent | null = null
    let indexOfLastLiteralNode = 0
    const excerptAst = shallowCloneAst(fullAst, (node, parent, index) => {
      if (totalExcerptLengthSoFar >= pruneLength) return true
      const { value } = node as YastLiteral
      if (value != null) {
        parentOfLastLiteralNode = parent
        indexOfLastLiteralNode = index
        totalExcerptLengthSoFar += value.length
      }
      return false
    })

    if (
      parentOfLastLiteralNode != null &&
      parentOfLastLiteralNode!.type === 'text' &&
      totalExcerptLengthSoFar > pruneLength
    ) {
      // Try truncate last LiteralNode
      const parent = parentOfLastLiteralNode!
      parent.children = parent.children.map((node, i) => {
        if (i !== indexOfLastLiteralNode) return node
        return {
          ...node,
          value: (node as YastLiteral).value.slice(
            totalExcerptLengthSoFar - pruneLength,
          ),
        }
      })
    }
    return excerptAst
  }

  return {
    access: {
      type: 'String',
      async resolve(markdownNode: Node): Promise<string> {
        const { access } = (markdownNode.frontmatter ?? {}) as Record<
          string,
          string
        >
        return access ?? 'public'
      },
    },
    title: {
      type: 'String',
      async resolve(markdownNode: Node): Promise<string> {
        const { title } = (markdownNode.frontmatter ?? {}) as Record<
          string,
          string
        >
        if (title != null) return title

        // Try to resolve the markdownNode relative filepath,
        // otherwise, return it id.
        const parent: Node = api.getNode(markdownNode.parent!)
        if (parent == null) return markdownNode.id
        return (parent.relativePath as string) ?? markdownNode.id
      },
    },
    createAt: {
      type: 'JSON',
      async resolve(markdownNode: Node): Promise<string> {
        const { createAt, date } = (markdownNode.frontmatter ?? {}) as any
        return createAt ?? date ?? new Date().toJSON()
      },
    },
    updateAt: {
      type: 'JSON',
      async resolve(markdownNode: Node): Promise<string> {
        const { updateAt, date } = (markdownNode.frontmatter ?? {}) as any
        return updateAt ?? date ?? new Date().toJSON()
      },
    },
    tags: {
      type: '[MarkdownYozoraTag]!',
      async resolve(markdownNode: Node): Promise<string[]> {
        const { tags = [] } = (markdownNode.frontmatter ?? {}) as any
        return tags.map(normalizeTagOrCategory)
      },
    },
    categories: {
      type: '[[MarkdownYozoraCategoryItem]]!',
      async resolve(markdownNode: Node): Promise<string[]> {
        const { categories = [] } = (markdownNode.frontmatter ?? {}) as any
        return categories.map((category: string[]) =>
          category.map(normalizeTagOrCategory),
        )
      },
    },
    toc: {
      type: 'MarkdownYozoraToc!',
      async resolve(markdownNode: Node): Promise<HeadingToc> {
        const ast = await getAst(markdownNode)
        const toc = calcHeadingToc(
          ast,
          options.headingIdentifierPrefix ?? 'heading-',
        )
        return toc
      },
    },
    ast: {
      type: 'JSON',
      async resolve(markdownNode: Node): Promise<Root> {
        const ast = await getAst(markdownNode)
        return ast
      },
    },
    excerptAst: {
      type: 'JSON',
      args: {
        pruneLength: {
          type: 'Int',
          defaultValue: 140,
        },
      },
      async resolve(
        markdownNode: Node,
        { pruneLength }: GetExcerptAstOptions,
      ): Promise<Root> {
        const fullAst = await getAst(markdownNode)
        const excerptAst = await getExcerptAst(fullAst, {
          pruneLength,
          excerptSeparator: options.frontmatter?.excerpt_separator,
        })
        return excerptAst
      },
    },
  }
}

interface GetExcerptAstOptions {
  pruneLength: number
  excerptSeparator?: string
}

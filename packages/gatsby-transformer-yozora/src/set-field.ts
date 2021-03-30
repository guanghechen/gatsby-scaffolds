import type { Root, YastLiteral, YastParent } from '@yozora/ast'
import type { Node, SetFieldsOnGraphQLNodeTypeArgs } from 'gatsby'
import type { TransformerYozoraOptions } from './types'
import { parseMarkdown, shallowCloneAst } from './util/yast'

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
  const { cache, pathPrefix } = api

  /**
   * Calc Yast Root from markdownNode.
   *
   * @param markdownNode
   * @returns
   */
  async function getAst(markdownNode: Node): Promise<Root> {
    const cacheKey = 'transformer-yozora-ast:' + markdownNode.id

    // Check from cache.
    const cachedAST = await cache.get(cacheKey)
    if (cachedAST != null) return cachedAST

    // Check from promise cache.
    const promise = astPromiseMap.get(cacheKey)
    if (promise != null) return await promise

    const astPromise = parseMarkdown(
      markdownNode.internal.content || '',
      options,
      pathPrefix,
    )
    astPromiseMap.set(cacheKey, astPromise)

    try {
      const ast = await astPromise
      await cache.set(cacheKey, ast)
      return ast
    } finally {
      astPromiseMap.delete(cacheKey)
    }
  }

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

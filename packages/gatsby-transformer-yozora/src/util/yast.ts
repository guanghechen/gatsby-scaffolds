import type {
  Root,
  YastNode,
  YastNodeType,
  YastParent,
  YastResource,
} from '@yozora/ast'
import { DefinitionType, ImageType, LinkType } from '@yozora/ast'
import type { YastParser } from '@yozora/core-parser'
import { createExGFMParser, createGFMParser } from '@yozora/parser-gfm'
import type { TransformerYozoraOptions } from '../types'

/**
 * Traverse yozora AST, and provide an opportunity to perform an action on
 * visited node.
 *
 * Note that the root node will not be traversed, that is, the root node will
 * never be passed into the `mutate` function..
 *
 * @param root
 * @param mutate
 * @param types
 */
export function traverseYozoraAST(
  root: Root,
  mutate: (node: YastNode, parent: YastParent, childIndex: number) => void,
  types: YastNodeType[] = [],
): void {
  const visit = (u: YastNode): void => {
    const { children } = u as YastParent

    // Recursively visit.
    if (children != null) {
      for (let i = 0; i < children.length; ++i) {
        const v = children[i]
        if (types.indexOf(v.type) > -1) {
          mutate(v, (u as unknown) as YastParent, i)
        }
        visit(v)
      }
    }
  }
  visit(root)
}

/**
 * Shallow clone ast until the match reaches the termination condition.
 * Note that the root node will not be traversed, that is, the root node will
 * never be passed into the `endCondition` function.
 *
 * @param root
 * @param endCondition
 * @returns
 */
export function shallowCloneAst(
  root: Root,
  endCondition: (
    node: YastNode,
    parent: YastParent,
    childIndex: number,
  ) => boolean,
): Root {
  const clone = <T extends YastNode = YastNode>(u: T): T => {
    const { children } = (u as unknown) as YastParent
    if (children == null) return u

    const nextChildren = []
    for (let i = 0; i < children.length; ++i) {
      const v = children[i]
      if (endCondition(v, (u as unknown) as YastParent, i)) break
      nextChildren.push(clone(v))
    }
    return { ...u, children: nextChildren }
  }
  return clone(root)
}

let _parser: YastParser | null = null,
  _parserOptions: TransformerYozoraOptions = {}

/**
 * Get yozora parser.
 *
 * @param options
 * @returns
 */
export function getParser(options: TransformerYozoraOptions): YastParser {
  const { gfmEx = false, shouldReservePosition = false } = options ?? {}
  if (
    _parser != null &&
    gfmEx === _parserOptions.gfmEx &&
    shouldReservePosition === _parserOptions.shouldReservePosition
  ) {
    return _parser
  }

  _parser = gfmEx
    ? createExGFMParser({ shouldReservePosition })
    : createGFMParser({ shouldReservePosition })
  _parserOptions = { gfmEx, shouldReservePosition }
  return _parser
}

/**
 * Parse markdown contents & resolve url references.
 *
 * @param content
 * @param options
 * @param basePath
 * @returns
 */
export function parseMarkdown(
  content: string,
  options: TransformerYozoraOptions,
  resolveUrl?: (url: string) => string,
): Root {
  const parser = getParser(options)
  const ast = parser.parse(content)

  // Correct url paths.
  if (resolveUrl != null) {
    traverseYozoraAST(
      ast,
      node => {
        const o = node as YastNode & YastResource
        if (o.url != null) o.url = resolveUrl(o.url)
      },
      [DefinitionType, LinkType, ImageType],
    )

    for (const definition of Object.values(ast.meta.definitions)) {
      definition.url = resolveUrl(definition.url)
    }
  }

  return ast
}

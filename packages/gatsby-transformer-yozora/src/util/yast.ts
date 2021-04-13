import type { Root, YastNode, YastResource } from '@yozora/ast'
import { DefinitionType, ImageType, LinkType } from '@yozora/ast'
import { traverseAST } from '@yozora/ast-util'
import type { YastParser } from '@yozora/core-parser'
import YozoraParser from '@yozora/parser'
import type { TransformerYozoraOptions } from '../types'

let _parser: YastParser | null = null

/**
 * Get yozora parser.
 *
 * @param options
 * @returns
 */
export function getParser(options: TransformerYozoraOptions): YastParser {
  if (_parser != null) return _parser

  const {
    parser,
    inlineFallbackTokenizer,
    blockFallbackTokenizer,
    tokenizers = [],
  } = options ?? {}

  _parser = parser ?? new YozoraParser(options.parserOptions)

  for (const tokenizer of tokenizers) {
    _parser.useTokenizer(tokenizer)
  }
  if (blockFallbackTokenizer != null) {
    _parser.useBlockFallbackTokenizer(blockFallbackTokenizer)
  }
  if (inlineFallbackTokenizer != null) {
    _parser.useInlineFallbackTokenizer(inlineFallbackTokenizer)
  }
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

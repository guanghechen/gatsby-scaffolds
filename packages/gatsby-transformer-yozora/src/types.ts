import type { Root } from '@yozora/ast'
import type { YastParser } from '@yozora/core-parser'
import type {
  BlockFallbackTokenizer,
  InlineFallbackTokenizer,
  Tokenizer,
} from '@yozora/core-tokenizer'
import type { GatsbyCache, Node, Reporter } from 'gatsby'

/**
 * Api passed to the options.plugins
 */
export interface AstMutateApi {
  files: Node[]
  markdownNode: Node
  markdownAST: Root
  pathPrefix: string
  getNode(id: string): Node
  reporter: Reporter
  cache: GatsbyCache
}

/**
 * Options of `@guanghechen/gatsby-transformer-yozora`
 */
export interface TransformerYozoraOptions {
  /**
   * Whether if enable GFM extensions
   * @default false
   */
  gfmEx?: boolean
  /**
   * Whether if reserve positions from the ast.
   * @default false
   */
  shouldReservePosition?: boolean
  /**
   * Options for `gray-matter`
   */
  frontmatter?: {
    /**
     * Slug field name.
     * @default 'slug'
     */
    slugField?: string
    excerpt_separator?: string
    parser?(): void
    eval?: boolean
    excerpt?: boolean | ((input: any, options: any) => string)
    engines?: any
    language?: string
    delimiters?: string | [string, string]
  }
  /**
   * Yozora markdown parser.
   */
  parser?: YastParser
  /**
   * Additional Yozora tokenizers.
   */
  tokenizers?: Tokenizer[]
  /**
   * Inline fallback tokenizer
   */
  inlineFallbackTokenizer?: InlineFallbackTokenizer
  /**
   * Block fallback tokenizer
   */
  blockFallbackTokenizer?: BlockFallbackTokenizer
  /**
   * Plugins.
   *
   * - createSchemaCustomization for gatsby
   */
  plugins?: Array<{
    /**
     * Plugin name, if not present, the value of property `resolve` will be the
     * fallback.
     */
    name?: string
    /**
     * The entry filepath or a npm package name of the plugin.
     */
    resolve: string
    /**
     * Plugin options.
     */
    options: any
  }>
}
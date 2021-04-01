import type { Tokenizer } from '@yozora/core-tokenizer'

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
   * Additional Yozora tokenizers.
   */
  tokenizers?: Tokenizer[]
  /**
   * Plugins.
   *
   * - createSchemaCustomization for gatsby
   */
  plugins?: Array<{
    resolve: string
    options: any
  }>
}

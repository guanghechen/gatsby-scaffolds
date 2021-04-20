import type { Definition, FootnoteDefinition, Root } from '@yozora/ast'
import type { ParseOptions, YastParser } from '@yozora/core-parser'
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
   * A yozora markdown parser.
   * @see https://github.com/guanghechen/yozora
   */
  parser: YastParser
  /**
   * Preset footnote reference definitions
   */
  presetFootnoteDefinitions?: FootnoteDefinition[]
  /**
   * Preset link reference definitions
   */
  presetDefinitions?: Definition[]
  /**
   * Replace footnotes into reference footnotes and footnote reference definitions.
   * @default false
   */
  preferFootnoteReferences?: boolean
  /**
   * prefix of footnoteReference.identifier
   * @default 'footnote-'
   */
  footnoteIdentifierPrefix?: string
  /**
   * prefix of heading.identifier
   * @default 'heading-'
   */
  headingIdentifierPrefix?: string
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

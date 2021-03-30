import type { CreateSchemaCustomizationArgs } from 'gatsby'
import type { TransformerYozoraOptions } from './types'

const typeDefs = `
  enum MarkdownHeadingLevels {
    h1
    h2
    h3
    h4
    h5
    h6
  }

  type MarkdownYozora implements Node @infer @childOf(mimeTypes: ["text/markdown", "text/x-markdown"]) {
    id: ID!
    excerpt: String!
    ast: JSON!
  }
`

/**
 * Create custom graphql schema.
 *
 * @param {*} api
 * @param {*} options
 */
export async function createSchemaCustomization(
  api: CreateSchemaCustomizationArgs,
  options: TransformerYozoraOptions,
): Promise<void> {
  api.actions.createTypes(typeDefs)

  /**
   * This allows sub-plugins to use Node APIs bound to
   * `@guanghechen/gatsby-transformer-yozora` to customize the GraphQL schema.
   * This makes it possible for sub-plugins to modify types owned by
   * `@guanghechen/gatsby-transformer-remark`.
   */
  const plugins = options.plugins ?? []
  for (const plugin of plugins) {
    const resolvedPlugin = await import(plugin.resolve)
    if (typeof resolvedPlugin.createSchemaCustomization === `function`) {
      resolvedPlugin.createSchemaCustomization(api, plugin.options)
    }
  }
}

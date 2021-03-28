export interface GatsbyPluginStylusOptions {
  /**
   * Webpack.Rule for.
   * @default {}
   */
  stylusRule?: any
  /**
   * Webpack.Rule.
   * @default {}
   */
  moduleStylusRule?: any
  /**
   * Whether to generate *.sourcemap.
   * @default false
   */
  shouldUseSourceMap?: boolean
  /**
   * Whether to generate *.d.ts for *.styl files.
   * @default false
   */
  shouldGenerateDts?: boolean
  /**
   * Options for 'css-loader'
   */
  cssLoaderOptions?: any
  /**
   * Options for 'stylus-loader'.
   */
  stylusLoaderOptions?: any
  /**
   * Options for 'postcss-loader'.
   */
  postcssLoaderOptions?: any
}

/**
 *
 * @param hookEnv   Gatsby hook env
 * @param options   Options of this plugin specified by user
 */
export function onCreateWebpackConfig(
  hookEnv: any,
  options?: GatsbyPluginStylusOptions,
): any

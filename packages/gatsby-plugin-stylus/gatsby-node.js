/**
 *
 * @param {*} param0
 * @param {GatsbyPluginStylusOptions} param1
 */
exports.onCreateWebpackConfig = function (
  { stage, loaders, actions },
  {
    stylusRule = {},
    moduleStylusRule = {},
    shouldUseSourceMap = false,
    shouldGenerateDts = false,
    cssLoaderOptions = {},
    stylusLoaderOptions = {},
    postcssLoaderOptions = {},
  } = {},
) {
  const isSSR = [`develop-html`, `build-html`].includes(stage)

  const stylusLoaders = shouldModules => {
    const modulesOptions = {
      namedExport: false,
      exportLocalsConvention: 'camelCaseOnly',
      ...cssLoaderOptions.modules,
    }

    // Generate *.d.ts for stylus files
    const dtsLoader = shouldModules &&
      shouldGenerateDts && {
        loader: '@teamsupercell/typings-for-css-modules-loader',
      }

    // Process css contents
    const cssLoader = loaders.css({
      esModule: true,
      import: true,
      importLoaders: 1,
      sourceMap: shouldUseSourceMap,
      ...cssLoaderOptions,
      modules: shouldModules ? modulesOptions : false,
    })

    // Processing stylus contents.
    const stylusLoader = {
      loader: 'stylus-loader',
      options: {
        sourceMap: shouldUseSourceMap,
        ...stylusLoaderOptions,
      },
    }

    return [
      !isSSR &&
        loaders.miniCssExtract({
          modules: shouldModules
            ? { namedExport: modulesOptions.namedExport }
            : {},
        }),
      dtsLoader,
      cssLoader,
      loaders.postcss(postcssLoaderOptions),
      stylusLoader,
    ].filter(Boolean)
  }

  const stylusRegex = stylusRule.test ?? /\.styl$/
  const moduleStylusRegex = moduleStylusRule.test ?? /\.module\.styl$/
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          exclude: moduleStylusRegex,
          ...stylusRule,
          test: stylusRegex,
          use: stylusLoaders(false),
        },
        {
          ...moduleStylusRule,
          test: moduleStylusRegex,
          use: stylusLoaders(true),
        },
      ],
    },
  })
}

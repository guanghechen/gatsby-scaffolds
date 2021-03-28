const { onCreateWebpackConfig } = require('../gatsby-node')

describe(`gatsby-plugin-stylus`, () => {
  const actions = {
    setWebpackConfig: jest.fn(),
  }

  // loaders "mocks"
  const loaders = {
    miniCssExtract: () => `miniCssExtract`,
    css: args => `css(${JSON.stringify(args)})`,
    postcss: args => `postcss(${JSON.stringify(args)})`,
    null: () => `null`,
  }

  beforeEach(() => {
    actions.setWebpackConfig.mockReset()
  })

  const stylusPlugin = jest.fn().mockReturnValue(`foo`)

  const tests = {
    stages: [`develop`, `build-javascript`, `develop-html`, `build-html`],
    options: {
      'Empty options': {},
      'No options': undefined,
      'Stylus options #1': {
        stylusRule: {
          use: [stylusPlugin()],
        },
        moduleStylusRule: {
          test: /\.custom\.styl$/,
          use: [stylusPlugin()],
          import: [`file.js`, `file2.js`],
        },
      },
      'Stylus options #2': {
        shouldGenerateDts: true,
        shouldUseSourceMap: true,
      },
      'PostCss plugins': {
        postCssPlugins: [`test1`],
      },
      'css-loader use commonjs': {
        cssLoaderOptions: {
          esModule: false,
          modules: {
            namedExport: false,
          },
        },
      },
    },
  }

  tests.stages.forEach(stage => {
    for (const label in tests.options) {
      const options = tests.options[label]
      it(`Stage: ${stage} / ${label}`, () => {
        onCreateWebpackConfig(
          {
            actions,
            loaders,
            stage,
          },
          options,
        )
        expect(actions.setWebpackConfig).toMatchSnapshot()
      })
    }
  })
})

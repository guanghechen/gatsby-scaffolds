<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/gatsby-scaffolds/tree/master/packages/gatsby-transformer-yozora#readme">@guanghechen/gatsby-transformer-yozora</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@guanghechen/gatsby-transformer-yozora">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@guanghechen/gatsby-transformer-yozora.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@guanghechen/gatsby-transformer-yozora">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@guanghechen/gatsby-transformer-yozora.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@guanghechen/gatsby-transformer-yozora">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@guanghechen/gatsby-transformer-yozora.svg"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@guanghechen/gatsby-transformer-yozora"
      />
    </a>
    <a href="https://github.com/gatsbyjs/gatsby">
      <img
        alt="Gatsby Version"
        src="https://img.shields.io/npm/dependency-version/@guanghechen/rollup-config/peer/gatsby"
      />
    </a>
    <a href="https://github.com/facebook/jest">
      <img
        alt="Tested with Jest"
        src="https://img.shields.io/badge/tested_with-jest-9c465e.svg"
      />
    </a>
    <a href="https://github.com/prettier/prettier">
      <img
        alt="Code Style: prettier"
        src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      />
    </a>
  </div>
</header>
<br/>

A gatsby plugin for transforming markdown files to markdown ast through 
[Yozora][yozora-repo] Parser, Inspired by [gatsby-transformer-remark][].

## Install

This plugin depends on Yozora Parser, as of now, you can choose 
[@yozora/parser][] (Recommend) or [@yozora/parser-gfm][] or [@yozora/parser-gfm-ex].

* npm

  ```bash
  npm install @guanghechen/gatsby-transformer-yozora @yozora/parser --save-dev
  ```

* yarn

  ```bash
  yarn add @guanghechen/gatsby-transformer-yozora @yozora/parser --dev
  ```

## Usage

Add configs in `gatsby-config.js`:

```javascript
// gatsby-config.js
const { YozoraParser } = require('@yozora/parser')

module.exports = {
  plugins: [
    {
      resolve: '@guanghechen/gatsby-transformer-yozora',
      options: {
        parser: new YozoraParser(),
        preferFootnoteReferences: true,
        frontmatter: {
          excerpt_separator: '<!-- more -->',
        }
      }
    }
  ]
}
```

### Options

Name                        | Required  | Default
:---------------------------|:----------|:-----------
`parser`                    | `true`    | -
`parseOptions`              | `false`   | -
`preferFootnoteReferences`  | `false`   | `false`
`headingIdentifierPrefix`   | `false`   | `heading-`
`footnoteIdentifierPrefix`  | `false`   | `footnote-`
`frontmatter`               | `false`   | -
`plugins`                   | `false`   | -


* `parser`: A [yozora][yozora-repo] parser.

* `parseOptions`: Options for `parser.parse()`

* `preferFootnoteReferences`: Replace footnotes into footnote references and 
  footnote reference definitions.

* `headingIdentifierPrefix`: The identifier prefix of the headings that 
  constitutes the toc (Table of Content).

* `footnoteIdentifierPrefix`: The identifier prefix of the footnote references
  and footnote reference definitions.

* `frontmatter`: Options for [gray-matter][].

* `plugins`: Plugins of [@guanghechen/gatsby-transformer-yozora][], similar with the
  plugins option of [gatsby-transformer-remark][].

  ```typescript
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

  function plugin(api: AstMutateApi, pluginOptions: any): void
  ```

  - `api`: passed by [@guanghechen/gatsby-transformer-yozora][]
  - `pluginOptions`: defined in `gatsby-config.js`, such as the highlighted 
    line in the following code (line eight)

    ```javascript {8}
    {
      resolve: '@guanghechen/gatsby-transformer-yozora',
      options: {
        parser: new YozoraParser(),
        plugins: [
          {
            resolve: '@guanghechen/gatsby-yozora-images',
            options: {},    // this is the pluginOptions.
          },
        ],
      },
    }
    ```


## FAQ

* How to deal with images referenced in markdown files, like [gatsby-remark-images][] does?

  See [@guanghechen/gatsby-yozora-images][].


## Related

* [@guanghechen/gatsby-yozora-images][]
* [@yozora/ast][]
* [@yozora/parser][]
* [@yozora/parser-gfm][]
* [@yozora/parser-gfm-ex][]
* [gatsby-transformer-remark][]
* [gray-matter][]


[homepage]: https://github.com/guanghechen/gatsby-scaffolds/tree/master/packages/gatsby-transformer-yozora#readme
[yozora-repo]: https://github.com/guanghechen/yozora
[@guanghechen/gatsby-transformer-yozora]: https://github.com/guanghechen/gatsby-scaffolds/tree/master/packages/gatsby-transformer-yozora#readme
[@guanghechen/gatsby-yozora-images]: https://github.com/guanghechen/gatsby-scaffolds/tree/master/packages/gatsby-yozora-images#readme
[@yozora/ast]: https://github.com/guanghechen/yozora/tree/master/packages/ast
[@yozora/parser]: https://github.com/guanghechen/yozora/tree/master/packages/parser
[@yozora/parser-gfm]: https://github.com/guanghechen/yozora/tree/master/packages/parser-gfm
[@yozora/parser-gfm-ex]: https://github.com/guanghechen/yozora/tree/master/packages/parser-gfm-ex
[gatsby-transformer-remark]: https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark
[gatsby-remark-images]: https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images
[gray-matter]: https://github.com/jonschlinkert/gray-matter

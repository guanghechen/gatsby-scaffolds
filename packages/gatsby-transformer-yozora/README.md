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


Transform markdown files to Yozora AST. Inspired by [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark).

## Install

* npm

  ```bash
  npm install @guanghechen/gatsby-transformer-yozora --save-dev
  ```

* yarn

  ```bash
  yarn add @guanghechen/gatsby-transformer-yozora --dev
  ```

## Usage

Add configs in `gatsby-config.js`:

```javascript
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: '@guanghechen/gatsby-transformer-yozora',
      options: {
        frontmatter: {
          excerpt_separator: '<!-- more -->',
        }
      }
    }
  ]
}
```


[homepage]: https://github.com/guanghechen/gatsby-scaffolds/tree/master/packages/gatsby-transformer-yozora#readme

<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/gatsby-scaffolds/tree/master/packages/gatsby-yozora-images#readme">@guanghechen/gatsby-yozora-images</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@guanghechen/gatsby-yozora-images">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@guanghechen/gatsby-yozora-images.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@guanghechen/gatsby-yozora-images">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@guanghechen/gatsby-yozora-images.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@guanghechen/gatsby-yozora-images">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@guanghechen/gatsby-yozora-images.svg"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@guanghechen/gatsby-yozora-images"
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


Transform markdown files to Yozora AST. Inspired by [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark).

## Install

* npm

  ```bash
  npm install @guanghechen/gatsby-transformer-yozora @guanghechen/gatsby-yozora-images --save-dev
  ```

* yarn

  ```bash
  yarn add @guanghechen/gatsby-transformer-yozora @guanghechen/gatsby-yozora-images --dev
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

        plugins: [
          {
            resolve: '@guanghechen/gatsby-yozora-images',
            options: {},
          }
        ]
      }
    }
  ]
}
```


[homepage]: https://github.com/guanghechen/gatsby-scaffolds/tree/master/packages/gatsby-yozora-images#readme

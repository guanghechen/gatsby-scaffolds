import type { Root, YastNode, YastNodeType, YastParent } from '@yozora/ast'
import path from 'path'
import queryString from 'query-string'

export interface ImageInfo {
  ext: string
  url: string
  query: Record<string, unknown>
}

/**
 * Calc image info from uri.
 * @param uri
 * @returns
 */
export function getImageInfo(uri: string): ImageInfo {
  const { url, query } = queryString.parseUrl(uri)
  return {
    ext: path.extname(url).split(`.`).pop() ?? '',
    url,
    query,
  }
}

/**
 * Check whether if the given url is a relative url
 * @param url
 * @returns
 * @see https://github.com/sindresorhus/is-relative-url
 * @see https://github.com/sindresorhus/is-absolute-url
 */
export function isRelativeUrl(url: string): boolean {
  // Don't match Windows paths `c:\`
  if (/^[a-zA-Z]:\\/.test(url)) return true

  // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
  // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
  return !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)
}

/**
 * Traverse yozora AST, and provide an opportunity to perform an action on
 * visited node.
 *
 * Note that the root node will not be traversed, that is, the root node will
 * never be passed into the `mutate` function..
 *
 * @param root
 * @param mutate
 * @param types
 */
export function traverseYozoraAST(
  root: Root,
  mutate: (node: YastNode, parent: YastParent, childIndex: number) => void,
  types: YastNodeType[] = [],
): void {
  const visit = (u: YastNode): void => {
    const { children } = u as YastParent

    // Recursively visit.
    if (children != null) {
      for (let i = 0; i < children.length; ++i) {
        const v = children[i]
        if (types.indexOf(v.type) > -1) {
          mutate(v, (u as unknown) as YastParent, i)
        }
        visit(v)
      }
    }
  }
  visit(root)
}

/**
 * Join url path with `prefix` and normalize the result.
 *
 * @param prefix
 * @param path
 * @returns
 */
export function resolveUrl(prefix: string, path: string): string {
  return (prefix + path).replace(/[/]+/g, '/')
}

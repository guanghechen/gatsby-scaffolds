/**
 * Join url path with `prefix` and normalize the result.
 *
 * @param prefix
 * @param path
 * @returns
 */
export function resolveUrl(...pathPieces: string[]): string {
  if (pathPieces.length <= 0) return ''
  const lastPiece = pathPieces[pathPieces.length - 1]

  // If the last path piece is a absolute url path, then return it directly,
  // otherwise, resolved it with previous url paths.
  return /^([/]|\w+:[/]{2})/.test(lastPiece)
    ? lastPiece
    : pathPieces
        .join('/')
        .replace(/[/]+/g, '/')
        .replace(/[/][.][/]/g, '/')
}

import { isNonBlankString } from '@guanghechen/option-helper'

/**
 * Join url path with `prefix` and normalize the result.
 *
 * @param prefix
 * @param path
 * @returns
 */
export function resolveUrl(
  ...pathPieces: Array<string | null | undefined>
): string {
  const pieces: string[] = pathPieces.filter(isNonBlankString)
  if (pieces.length <= 0) return ''

  // If the last path piece is a absolute url path, then return it directly,
  // otherwise, resolved it with previous url paths.
  const lastPiece = pieces[pieces.length - 1]
  return /^([/]|\w+:[/]{2})/.test(lastPiece)
    ? lastPiece
    : pieces
        .join('/')
        .replace(/[/]+/g, '/')
        .replace(/[/][.][/]/g, '/')
        .trim()
}

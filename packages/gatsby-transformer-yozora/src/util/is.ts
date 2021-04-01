/**
 * Checks whether the given value is an object of type Date.
 * @param value
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isDate = (value: any): value is Date => {
  if (Object.prototype.toString.call(value) !== '[object Date]') return false
  if (value instanceof Date) return true
  return typeof value.getMonth === 'function'
}

/**
 *
 * @param date
 * @returns
 */
export const isDate = (date: any): date is Date => {
  if (Object.prototype.toString.call(date) !== '[object Date]') return false
  if (date instanceof Date) return true
  return typeof date.getMonth === 'function'
}

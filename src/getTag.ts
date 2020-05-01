/**
 * Gets the `toStringTag` of `value`.
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 * @example
 * ```javascript
 * getTag(1)
 * // => '[object Number]'
 *
 * getTag(null)
 * // => '[object Null]'
 * ```
 */
export function getTag(value: any): string {
  return Object.prototype.toString.call(value);
}

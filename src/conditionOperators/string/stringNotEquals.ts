/**
 * Negated string matching.
 *
 * @since 4.4.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * stringNotEquals('hi', 'no')
 * // => true
 * 
 * stringNotEquals('hi', 'hi')
 * // => false
 * ```
 */
export function stringNotEquals(data: string, expected: string): boolean {
  return (
    data !== expected
  );
}

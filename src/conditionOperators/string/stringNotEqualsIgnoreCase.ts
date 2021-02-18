/**
 * Negated string matching, ignoring case.
 *
 * @since 4.4.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * stringNotEqualsIgnoreCase('hi', 'no')
 * // => true
 * 
 * stringNotEqualsIgnoreCase('hi', 'Hi')
 * // => false
 * ```
 */
export function stringNotEqualsIgnoreCase(data: string, expected: string): boolean {
  return (
    data.toLowerCase() !== expected.toLowerCase()
  );
}

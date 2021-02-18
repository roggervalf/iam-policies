/**
 * Exact matching, ignoring case.
 *
 * @since 4.4.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * stringEqualsIgnoreCase('hi', 'Hi')
 * // => true
 *
 * stringEqualsIgnoreCase('hi', 'no')
 * // => false
 * ```
 */
export function stringEqualsIgnoreCase(data: string, expected: string): boolean {
  return (
    data.toLowerCase() === expected.toLowerCase()
  );
}

/**
 * Exact matching, case sensitive.
 *
 * @since 4.3.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * stringEquals('hi', 'hi')
 * // => true
 *
 * stringEquals('hi', 'no')
 * // => false
 * ```
 */
export function stringEquals(data: string, expected: string): boolean {
  return (
    data === expected
  );
}

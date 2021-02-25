/**
 * Numeric less than or equals matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is less than or equals `expected value`.
 * @example
 * ```javascript
 * numericLessThanEquals(5, 5)
 * // => true
 *
 * numericLessThanEquals(8, 4)
 * // => false
 * ```
 */
export function numericLessThanEquals(data: number, expected: number): boolean {
  return (
    data <= expected
  );
}

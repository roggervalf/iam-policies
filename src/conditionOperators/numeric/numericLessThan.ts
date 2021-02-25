/**
 * Numeric less than matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is less than `expected value`.
 * @example
 * ```javascript
 * numericLessThan(5, 6)
 * // => true
 *
 * numericLessThan(8, 4)
 * // => false
 * ```
 */
export function numericLessThan(data: number, expected: number): boolean {
  return (
    data < expected
  );
}

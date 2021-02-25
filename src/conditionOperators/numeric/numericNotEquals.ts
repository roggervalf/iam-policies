/**
 * Negated numeric matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * numericNotEquals(2, 4)
 * // => true
 *
 * numericNotEquals(5, 5)
 * // => false
 * ```
 */
export function numericNotEquals(data: number, expected: number): boolean {
  return (
    data !== expected
  );
}

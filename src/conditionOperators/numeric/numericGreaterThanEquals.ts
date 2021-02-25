/**
 * Numeric greater than or equals matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is greater than or equals `expected value`.
 * @example
 * ```javascript
 * numericGreaterThanEquals(5, 5)
 * // => true
 *
 * numericGreaterThanEquals(4, 8)
 * // => false
 * ```
 */
export function numericGreaterThanEquals(data: number, expected: number): boolean {
  return (
    data >= expected
  );
}

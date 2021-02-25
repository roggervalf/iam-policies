/**
 * Numeric greater than matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is greater than `expected value`.
 * @example
 * ```javascript
 * numericGreaterThan(6, 5)
 * // => true
 *
 * numericGreaterThan(4, 8)
 * // => false
 * ```
 */
export function numericGreaterThan(data: number, expected: number): boolean {
  return (
    data > expected
  );
}

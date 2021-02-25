/**
 * Exact numeric matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * numericEquals(5, 5)
 * // => true
 *
 * numericEquals(2, 4)
 * // => false
 * ```
 */
export function numericEquals(data: number, expected: number): boolean {
  return (
    data === expected
  );
}

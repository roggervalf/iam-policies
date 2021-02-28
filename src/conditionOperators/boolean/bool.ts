/**
 * Boolean matching.
 *
 * @since 4.7.0
 * @category Boolean
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * bool(true, true)
 * // => true
 *
 * bool(true, false)
 * // => false
 * ```
 */
export function bool(data: boolean, expected: boolean): boolean {
  return (
    data === expected
  );
}

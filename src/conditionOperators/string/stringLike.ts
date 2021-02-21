import {Matcher} from '../../Matcher';

/**
 * Case-sensitive matching. The values can include a multi-character match wildcard (*) anywhere in the string.
 *
 * @since 4.5.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal like `expected value`.
 * @example
 * ```javascript
 * stringLike('newHouse', 'new*')
 * // => true
 *
 * stringLike('House', 'new*')
 * // => false
 * ```
 */
export function stringLike(data: string, expected: string): boolean {
  return (
    new Matcher(data).match(expected)
  );
}

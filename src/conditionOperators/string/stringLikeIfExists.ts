import {stringLike} from './stringLike';

/**
 * Case-sensitive matching if exist. The values can include a multi-character match wildcard (*) anywhere in the string.
 *
 * @since 4.12.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal like `expected value` or if it does not exist.
 * @example
 * ```javascript
 * stringLikeIfExists(undefined, 'new*')
 * // => true
 *
 * stringLikeIfExists('House', 'new*')
 * // => false
 * ```
 */
export function stringLikeIfExists(data: string | undefined, expected: string): boolean {
  return data?(
    stringLike(data,expected)
  ):true;
}

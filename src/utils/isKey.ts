import { isSymbol } from './isSymbol';

/** Used to match property names within property paths. */
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/; //matches any word character (alphanumeric and underscore)

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @since 3.1.0
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 * @example
 * ```javascript
 * isKey(1)
 * // => true
 *
 * isKey('example[test]')
 * // => false
 *
 * isKey('a.b')
 * // => false
 *
 * const obj = {
 *   '[a]': 5,
 *   'b.c': true
 * };
 *
 * isKey('[a]', obj)
 * // => true
 *
 * isKey('b.c', obj)
 * // => true
 * ```
 */
export function isKey(
  value: unknown,
  object?: Record<PropertyKey, unknown>
): boolean {
  const type = typeof value;
  if (
    type === 'number' ||
    type === 'boolean' ||
    value === null ||
    value === undefined ||
    isSymbol(value)
  ) {
    return true;
  }
  if (typeof value === 'string') {
    return (
      reIsPlainProp.test(value) ||
      !reIsDeepProp.test(value) ||
      (object !== null && value in Object(object))
    );
  }
  return false;
}

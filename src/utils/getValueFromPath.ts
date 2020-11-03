import { toKey } from './toKey';
import { isKey } from './isKey';
import { stringToPath } from './stringToPath';

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
export function castPath<T>(
  value: unknown,
  object: Record<PropertyKey, unknown>
): Array<T> {
  if (Array.isArray(value)) {
    return value;
  }

  return isKey(value, object) ? [value] : stringToPath(value);
}

/**
 * The base implementation of `get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
export function baseGet<T>(
  object: Record<PropertyKey, unknown>,
  path: Array<T> | string
): any {
  const newPath = castPath(path, object);

  let index = 0;
  const length = newPath.length;

  let value: any = object;
  while (value instanceof Object && index < length) {
    value = value[toKey(newPath[index++])];
  }

  return index && index === length ? value : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @since 3.1.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
 *
 * getValueFromPath(object, 'a[0].b.c')
 * // => 3
 *
 * getValueFromPath(object, ['a', '0', 'b', 'c'])
 * // => 3
 *
 * getValueFromPath(object, 'a.b.c', 'default')
 * // => 'default'
 */
export function getValueFromPath<T>(
  object: Record<PropertyKey, unknown>,
  path: Array<T> | string,
  defaultValue?: unknown
): any {
  const result = object === null ? undefined : baseGet(object, path);

  return result === undefined ? defaultValue : result;
}

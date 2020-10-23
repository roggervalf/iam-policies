import { MemoizeInterface } from '../types';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * @since 3.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 * ```javascript
 * const object = { 'a': 1, 'b': 2 }
 * const other = { 'c': 3, 'd': 4 }
 *
 * const values = memoize(values)
 * values(object)
 * // => [1, 2]
 *
 * values(other)
 * // => [3, 4]
 *
 * object.a = 2
 * values(object)
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b'])
 * values(object)
 * // => ['a', 'b']
 * ```
 */
export function memoize(
  func: (...args: unknown[]) => any,
  resolver?: (...args: unknown[]) => any
): MemoizeInterface {
  const memoized = function (
    this: (...args: unknown[]) => any,
    ...args: unknown[]
  ): MemoizeInterface {
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = new Map();
  return memoized;
}

/*const memoize = (fn: Function): Function => {
  const cache = {};
  return (...args): any => {
    const stringifiedArgs = JSON.stringify(args);
    const result = (cache[stringifiedArgs] =
      typeof cache[stringifiedArgs] === 'undefined'
        ? fn(...args)
        : cache[stringifiedArgs]);
    return result;
  };
};*/

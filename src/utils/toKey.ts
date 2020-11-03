import { isSymbol } from './isSymbol';

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @since 3.1.0
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 * @example
 *
 * toKey(Symbol.iterator)
 * // => true
 *
 * toKey('abc')
 * // => false
 */
export function toKey(value: unknown): string | symbol {
  if (typeof value === 'string' || isSymbol(value)) {
    return value;
  }

  return value === 0 && 1 / value === -INFINITY ? '-0' : `${value}`;
}

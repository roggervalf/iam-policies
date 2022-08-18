import { getValueFromPath } from './getValueFromPath';

const reDelimiters = /\${([^}]*)}/g;
const trim = / +(?= )|^\s+|\s+$/g;

const specialTrim = (str: string): string => str.replace(trim, '');

/**
 * Apply the context value in a string.
 *
 * @param {string} str Pattern string, containing context path.
 * @param {object} context Object to get values from path.
 * @returns {string} Returns a string with embedded context values.
 * @example
 * ```javascript
 * const context = {
 *   user: { id: 456, bestFriends: [123, 532, 987], oid: new ObjectId('62fe296afd3ad81be5088699') },
 * };
 * applyContext('secrets:${user.id}:*', context)
 * // => 'secrets:456:*'
 *
 * applyContext('secrets:${user.bestFriends}:*', context)
 * // => 'secrets:{123,532,987}:*'
 *
 * applyContext('secrets:${user.oid}:*', context)
 * // => 'secrets:62fe296afd3ad81be5088699:*'
 *
 * applyContext('secrets:${company.address}:account', context)
 * // => 'secrets:undefined:account'
 * ```
 */
export function applyContext<T extends object>(
  str: string,
  context?: T
): string {
  if (!context) return str;

  return specialTrim(
    str.replace(reDelimiters, (_, path: string) => {
      const value = getValueFromPath(context, path);
      if (Array.isArray(value)) return `{${value}}`;
      if (value instanceof Object) {
        const json = value.toJSON?.();
        return typeof json === 'string' ? json : 'undefined';
      }

      return String(value);
    })
  );
}

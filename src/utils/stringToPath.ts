import { memoizeCapped } from './memoizeCapped';

const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\x02)[^\\\\]|\\\\.)*?)\\x02' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g'
);

/**
 * Converts `string` to a property path array.
 *
 * @since 3.1.0
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
export const stringToPath = memoizeCapped((string: string) => {
  const result = [];
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  string.replace(
    rePropName,
    (
      match: string,
      expression: string,
      quote: string,
      subString: string
    ): string => {
      let key = match;
      if (quote) {
        key = subString.replace(reEscapeChar, '$1');
      } else if (expression) {
        key = expression.trim();
      }
      result.push(key);
      return '';
    }
  );
  return result;
});

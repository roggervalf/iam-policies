import { DecomposeString } from '../types';

/**
 * Get index range where separators are found.
 *
 * @private
 * @since 3.1.1
 * @param {string} initialSeparator First string to be found.
 * @param {string} finalSeparator Second string to be found.
 * @param {string} str String to be decomposed.
 * @returns {number[]} Returns the beginning and final index for those matches.
 * @example
 * ```javascript
 * getIndexRange('first', 'Second', 'firstAndSecond')
 * // => [0, 8]
 *
 * getIndexRange('First', 'Second', '++FirstAndSecond**')
 * // => [2, 10]
 * ```
 */
function getIndexRange(
  initialSeparator: string,
  finalSeparator: string,
  str: string
): number[] {
  const beginningIndex = str.indexOf(initialSeparator);
  const finalIndex = str.indexOf(finalSeparator, beginningIndex + 1);

  if (beginningIndex >= 0 && finalIndex > 0) {
    return [beginningIndex, finalIndex];
  }

  return [-1, -1];
}

/**
 * Object returned by decomposeString function
 *
 * @typedef {Object} DecomposedString
 * @property {number} start Beginning index for first separator match
 * @property {number} end Final index for second separator match
 * @property {string} pre Substring before first separator
 * @property {string} body Substring between separators
 * @property {string} post Substring after second separator
 */

/**
 * Decompose string in pre, body and post strings by using separators.
 *
 * @private
 * @since 3.1.1
 * @param {string} initialSeparator First string to be found.
 * @param {string} finalSeparator Second string to be found.
 * @param {string} str String to be decomposed.
 * @returns {DecomposedString} Returns a decompose string.
 * @example
 * ```javascript
 * decomposeString('first', 'Second', 'firstAndSecond')
 * // => { start: 0, end: 8, pre: '', body: 'And', post: '' }
 *
 * decomposeString('First', 'Second', '++FirstAndSecond**')
 * // => { start: 2, end: 10, pre: '++', body: 'And', post: '**' }
 * ```
 */
export function decomposeString(
  initialSeparator: string,
  finalSeparator: string,
  str: string
): DecomposeString {
  const [beginningIndex, finalIndex] = getIndexRange(
    initialSeparator,
    finalSeparator,
    str
  );

  return {
    start: beginningIndex,
    end: finalIndex,
    pre: beginningIndex >= 0 ? str.slice(0, beginningIndex) : '',
    body:
      beginningIndex >= 0
        ? str.slice(beginningIndex + initialSeparator.length, finalIndex)
        : '',
    post:
      beginningIndex >= 0 ? str.slice(finalIndex + finalSeparator.length) : ''
  };
}

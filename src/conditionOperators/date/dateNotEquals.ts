import {DateType, convertDate} from './convertDate';

/**
 * Negated date matching.
 *
 * @since 4.9.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * dateNotEquals('December 15, 1994 03:24:00', 'December 16, 1995 03:24:00')
 * // => true
 *
 * dateNotEquals('December 15, 2000 03:24:00', 'December 15, 2000 03:24:00')
 * // => false
 * ```
 */
export function dateNotEquals(data: DateType, expected: DateType): boolean {
  const convertedData = convertDate(data);
  const convertedExpectation = convertDate(expected);
  return (
    convertedData !== convertedExpectation
  );
}

import {DateType, convertDate} from './convertDate';

/**
 * Matching at or before a specific date and time
 *
 * @since 4.9.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal or before than `expected value`.
 * @example
 * ```javascript
 * dateLessThanEquals('December 15, 1994 03:24:00', 'December 15, 1994 03:24:00')
 * // => true
 *
 * dateLessThanEquals('December 15, 2000 03:24:00', 'December 15, 2000 03:24:00')
 * // => false
 * ```
 */
export function dateLessThanEquals(data: DateType, expected: DateType): boolean {
  const convertedData = convertDate(data);
  const convertedExpectation = convertDate(expected);
  return (
    convertedData <= convertedExpectation
  );
}

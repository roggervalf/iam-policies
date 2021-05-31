import { DateType, convertDate } from './convertDate';

/**
 * Matching after a specific date and time
 *
 * @since 4.11.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is after than `expected value`.
 * @example
 * ```javascript
 * dateGreaterThan('December 17, 1994 03:24:00', 'December 16, 1994 03:24:00')
 * // => true
 *
 * dateGreaterThan('December 15, 2000 03:24:00', 'December 15, 2000 03:24:00')
 * // => false
 * ```
 */
export function dateGreaterThan(data: DateType, expected: DateType): boolean {
  const convertedData = convertDate(data);
  const convertedExpectation = convertDate(expected);
  return convertedData > convertedExpectation;
}

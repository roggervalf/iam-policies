type DateType = Date | string;

const convertDate = (date: DateType): number=>{
  if(date instanceof Date){
    return date.getTime();
  }

  return Date.parse(date);
}

/**
 * Exact date matching.
 *
 * @since 4.8.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * dateEquals('December 15, 1994 03:24:00', 'December 15, 1994 03:24:00')
 * // => true
 *
 * dateEquals('December 15, 2000 03:24:00', 'December 10, 2001 03:24:00')
 * // => false
 * ```
 */
export function dateEquals(data: DateType, expected: DateType): boolean {
  const convertedData = convertDate(data);
  const convertedExpectation = convertDate(expected);
  return (
    convertedData === convertedExpectation
  );
}

import { numericNotEquals } from './numericNotEquals';

describe('numericNotEquals', () => {
  it('returns true', () => {
    expect(numericNotEquals(5, 6)).toBeTruthy;
    expect(numericNotEquals(-1, 1)).toBeTruthy;
    expect(numericNotEquals(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).toBeTruthy;
  });

  it('returns false', () => {
    expect(numericNotEquals(5, 5)).toBeFalsy;
    expect(numericNotEquals(2.2, 2.2)).toBeFalsy;
    expect(numericNotEquals(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBeFalsy;
  });
});

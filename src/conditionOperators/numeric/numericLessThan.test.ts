import { numericLessThan } from './numericLessThan';

describe('numericLessThan', () => {
  it('returns true', () => {
    expect(numericLessThan(5, 7)).toBeTruthy;
    expect(numericLessThan(2.2, 8.2)).toBeTruthy;
    expect(numericLessThan(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBeTruthy;
  });

  it('returns false', () => {
    expect(numericLessThan(7, 5)).toBeFalsy;
    expect(numericLessThan(-1, -1)).toBeFalsy;
    expect(numericLessThan(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).toBeFalsy;
  });
});

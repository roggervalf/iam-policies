import { numericLessThanEquals } from './numericLessThanEquals';

describe('numericLessThanEquals', () => {
  it('returns true', () => {
    expect(numericLessThanEquals(5, 5)).toBeTruthy;
    expect(numericLessThanEquals(2.2, 8.2)).toBeTruthy;
    expect(numericLessThanEquals(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBeTruthy;
  });

  it('returns false', () => {
    expect(numericLessThanEquals(7, 5)).toBeFalsy;
    expect(numericLessThanEquals(-1, -2)).toBeFalsy;
    expect(numericLessThanEquals(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).toBeFalsy;
  });
});

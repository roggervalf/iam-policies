import { numericEquals } from './numericEquals';

describe('numericEquals', () => {
  it('returns true', () => {
    expect(numericEquals(5, 5)).toBeTruthy;
    expect(numericEquals(2.2, 2.2)).toBeTruthy;
    expect(numericEquals(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBeTruthy;
  });

  it('returns false', () => {
    expect(numericEquals(5, 6)).toBeFalsy;
    expect(numericEquals(-1, 1)).toBeFalsy;
    expect(numericEquals(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).toBeFalsy;
  });
});

import { numericGreaterThanEquals } from './numericGreaterThanEquals';

describe('numericGreaterThanEquals', () => {
  it('returns true', () => {
    expect(numericGreaterThanEquals(5, 5)).toBeTruthy;
    expect(numericGreaterThanEquals(8.2, 2.2)).toBeTruthy;
    expect(numericGreaterThanEquals(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).toBeTruthy;
  });

  it('returns false', () => {
    expect(numericGreaterThanEquals(5, 7)).toBeFalsy;
    expect(numericGreaterThanEquals(-2, -1)).toBeFalsy;
    expect(numericGreaterThanEquals(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBeFalsy;
  });
});

import { numericGreaterThan } from './numericGreaterThan';

describe('numericGreaterThan', () => {
  it('returns true', () => {
    expect(numericGreaterThan(7, 5)).toBeTruthy;
    expect(numericGreaterThan(8.2, 2.2)).toBeTruthy;
    expect(numericGreaterThan(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).toBeTruthy;
  });

  it('returns false', () => {
    expect(numericGreaterThan(5, 7)).toBeFalsy;
    expect(numericGreaterThan(-1, -1)).toBeFalsy;
    expect(numericGreaterThan(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBeFalsy;
  });
});

import { bool } from './bool';

describe('bool', () => {
  it('returns true', () => {
    expect(bool(true, true)).toBeTruthy;
    expect(bool(false, false)).toBeTruthy;
  });

  it('returns false', () => {
    expect(bool(true, false)).toBeFalsy;
    expect(bool(false, true)).toBeFalsy;
  });
});

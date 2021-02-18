import { stringNotEqualsIgnoreCase } from './stringNotEqualsIgnoreCase';

describe('stringNotEqualsIgnoreCase', () => {
  it('returns true', () => {
    expect(stringNotEqualsIgnoreCase('secrets', 'house')).toBeTruthy;
    expect(stringNotEqualsIgnoreCase('house', 'secrets')).toBeTruthy;
    expect(stringNotEqualsIgnoreCase('', '1')).toBeTruthy;
  });

  it('returns false', () => {
    expect(stringNotEqualsIgnoreCase('secrets', 'Secrets')).toBeFalsy;
    expect(stringNotEqualsIgnoreCase('newHouse', 'NewHouse')).toBeFalsy;
    expect(stringNotEqualsIgnoreCase('', '')).toBeFalsy;
  });
});

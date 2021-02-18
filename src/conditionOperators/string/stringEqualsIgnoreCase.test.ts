import { stringEqualsIgnoreCase } from './stringEqualsIgnoreCase';

describe('stringEqualsIgnoreCase', () => {
  it('returns true', () => {
    expect(stringEqualsIgnoreCase('secrets', 'Secrets')).toBeTruthy;
    expect(stringEqualsIgnoreCase('newHouse', 'NewHouse')).toBeTruthy;
    expect(stringEqualsIgnoreCase('', '')).toBeTruthy;
  });

  it('returns false', () => {
    expect(stringEqualsIgnoreCase('secrets', 'house')).toBeFalsy;
    expect(stringEqualsIgnoreCase('house', 'secrets')).toBeFalsy;
    expect(stringEqualsIgnoreCase('', '1')).toBeFalsy;
  });
});

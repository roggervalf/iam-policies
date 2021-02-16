import { stringEquals } from './stringEquals';

describe('stringEquals', () => {
  it('returns true', () => {
    expect(stringEquals('secrets', 'secrets')).toBeTruthy;
    expect(stringEquals('house', 'house')).toBeTruthy;
    expect(stringEquals('', '')).toBeTruthy;
  });

  it('returns false', () => {
    expect(stringEquals('secrets', 'house')).toBeFalsy;
    expect(stringEquals('house', 'secrets')).toBeFalsy;
    expect(stringEquals('', '1')).toBeFalsy;
  });
});

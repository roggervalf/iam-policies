import { stringNotEquals } from './stringNotEquals';

describe('stringNotEquals', () => {
  it('returns true', () => {
    expect(stringNotEquals('secrets', 'Secrets')).toBeTruthy;
    expect(stringNotEquals('house', 'secrets')).toBeTruthy;
    expect(stringNotEquals('', '1')).toBeTruthy;
  });

  it('returns false', () => {
    expect(stringNotEquals('secrets', 'secrets')).toBeFalsy;
    expect(stringNotEquals('house', 'house')).toBeFalsy;
    expect(stringNotEquals('', '')).toBeFalsy;
  });
});

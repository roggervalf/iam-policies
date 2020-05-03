import { isSymbol } from './isSymbol';

describe('isSymbol', () => {
  it('should return `true` for symbols', () => {
    expect(isSymbol(Symbol())).toEqual(true);
    expect(isSymbol(Object(Symbol()))).toEqual(true);
  });

  it('should return `false` for non-symbols', () => {
    expect(isSymbol()).toEqual(false);
    expect(isSymbol(null)).toEqual(false);
    expect(isSymbol(undefined)).toEqual(false);
    expect(isSymbol(false)).toEqual(false);
    expect(isSymbol(0)).toEqual(false);
    expect(isSymbol(NaN)).toEqual(false);
    expect(isSymbol('')).toEqual(false);
    expect(isSymbol([1, 2, 3])).toEqual(false);
    expect(isSymbol(new Date())).toEqual(false);
    expect(isSymbol(new Error())).toEqual(false);
    expect(isSymbol(Array.prototype.slice)).toEqual(false);
    expect(isSymbol({ '0': 1, length: 1 })).toEqual(false);
    expect(isSymbol(/x/)).toEqual(false);
  });
});

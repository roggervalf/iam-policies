import { isKey } from './isKey';

describe('isKey', () => {
  describe('when only passing the value argument', () => {
    it('should get true', () => {
      expect(isKey(1)).toEqual(true);
      expect(isKey(Symbol())).toEqual(true);
      expect(isKey('attribute')).toEqual(true);
      expect(isKey('spaced attribute')).toEqual(true);
      expect(isKey(true)).toEqual(true);
      expect(isKey(null)).toEqual(true);
      expect(isKey(undefined)).toEqual(true);
    });
    it('should get false', () => {
      expect(isKey([1, ''])).toEqual(false);
      expect(isKey({})).toEqual(false);
      expect(isKey('something[test]')).toEqual(false);
      expect(isKey('a.b')).toEqual(false);
    });
  });
  describe('when passing the value and an object', () => {
    const obj = {
      '[a]': 5,
      'b.c': true
    };

    it('should get true', () => {
      expect(isKey('[a]', obj)).toEqual(true);
      expect(isKey('b.c', obj)).toEqual(true);
    });
    it('should get false', () => {
      expect(isKey('[b]', obj)).toEqual(false);
      expect(isKey('c.d', obj)).toEqual(false);
    });
  });
});

import { stringToPath } from './stringToPath';

describe('stringToPath', () => {
  describe("when matching anything that isn't a dot or bracket", () => {
    it('returns an array of strings', () => {
      expect(stringToPath('hi')).toEqual(['hi']);
      expect(stringToPath.cache.size).toEqual(1);
      expect(stringToPath('attribute?')).toEqual(['attribute?']);
      expect(stringToPath.cache.size).toEqual(2);
    });
  });
  describe('when matching property names within brackets', () => {
    it('returns an array of strings', () => {
      expect(stringToPath('first[second].third')).toEqual([
        'first',
        'second',
        'third'
      ]);
      expect(stringToPath('first[].third')).toEqual(['first', '', 'third']);
      expect(stringToPath("first['second\x02]")).toEqual(['first', 'second']);
    });
  });
  describe('when matching dots', () => {
    it('return a white space in the returned array path', () => {
      expect(stringToPath('.hi')).toEqual(['', 'hi']);
      expect(stringToPath('.hi.')).toEqual(['', 'hi', '']);
      expect(stringToPath('.hi..')).toEqual(['', 'hi', '', '']);
    });
  });
});

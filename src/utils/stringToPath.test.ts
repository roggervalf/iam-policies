import { stringToPath } from './stringToPath';

describe('stringToPath', () => {
  it("should match anything that isn't a dot or bracket", () => {
    expect(stringToPath('hi')).toEqual(['hi']);
    expect(stringToPath.cache.size).toEqual(1);
    expect(stringToPath('attribute?')).toEqual(['attribute?']);
    expect(stringToPath.cache.size).toEqual(2);
  });
  it('should match property names within brackets', () => {
    expect(stringToPath('first[second].third')).toEqual([
      'first',
      'second',
      'third'
    ]);
    expect(stringToPath('first[].third')).toEqual(['first', '', 'third']);
    expect(stringToPath("first['second\x02]")).toEqual(['first', 'second']);
  });
});

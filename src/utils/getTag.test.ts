import { getTag } from './getTag';

describe('getTag', () => {
  it('should get Number tag', () => {
    expect(getTag(1)).toEqual('[object Number]');
  });

  it('should get String tag', () => {
    expect(getTag('hello')).toEqual('[object String]');
  });

  it('should get Undefined tag', () => {
    expect(getTag(undefined)).toEqual('[object Undefined]');
  });

  it('should get Null tag', () => {
    expect(getTag(null)).toEqual('[object Null]');
  });
});

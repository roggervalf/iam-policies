import { stringLike } from './stringLike';

describe('stringLike', () => {
  it('returns true', () => {
    expect(stringLike('newHouse', 'new*')).toBeTruthy;
    expect(stringLike('topSecret', '*Secret')).toBeTruthy;
    expect(stringLike('hi', 'hi')).toBeTruthy;
  });

  it('returns false', () => {
    expect(stringLike('NewHouse', 'new*')).toBeFalsy;
    expect(stringLike('TopSecret', '*Secret')).toBeFalsy;
    expect(stringLike('hi', 'no')).toBeFalsy;
  });
});

import { stringLikeIfExists } from './stringLikeIfExists';

describe('stringLikeIfExists', () => {
  it('returns true', () => {
    expect(stringLikeIfExists('newHouse', 'new*')).toBeTruthy;
    expect(stringLikeIfExists('topSecret', '*Secret')).toBeTruthy;
    expect(stringLikeIfExists(undefined, 'hi')).toBeTruthy;
  });

  it('returns false', () => {
    expect(stringLikeIfExists('NewHouse', 'new*')).toBeFalsy;
    expect(stringLikeIfExists('TopSecret', '*Secret')).toBeFalsy;
    expect(stringLikeIfExists('hi', 'no')).toBeFalsy;
  });
});

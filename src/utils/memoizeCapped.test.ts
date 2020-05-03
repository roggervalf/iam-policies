import { memoizeCapped, MAX_MEMOIZE_SIZE } from './memoizeCapped';

describe('memoizeCapped', () => {
  it('should enforce a max cache size of `MAX_MEMOIZE_SIZE`', () => {
    function identity<T>(value: T): T {
      return value;
    }
    const memoized = memoizeCapped(identity);
    const cache = memoized.cache;

    Array.from(Array(MAX_MEMOIZE_SIZE).keys()).forEach((value, index) => {
      memoized(index);
    });
    expect(cache.size).toEqual(MAX_MEMOIZE_SIZE);
    memoized(MAX_MEMOIZE_SIZE);
    expect(cache.size).toEqual(1);
  });
});

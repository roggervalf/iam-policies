import { memoize } from './memoize';

describe('memoize', () => {
  it('should memoize results based on the first argument given', () => {
    const values = memoize((a: number, b: number, c: number) => {
      return a + b + c;
    });

    expect(values(1, 2, 3)).toEqual(6);
    expect(values(1, 3, 5)).toEqual(6);
  });

  it('should support a `resolver`', () => {
    const fn = function(a: number, b: number, c: number): number {
      return a + b + c;
    };
    const memoized = memoize(fn, fn);

    expect(memoized(1, 2, 3)).toEqual(6);
    expect(memoized(1, 3, 5)).toEqual(9);
  });

  it('should use `this` binding of function for `resolver`', () => {
    const fn = function(a: number): number {
      return a + this.b + this.c;
    };
    const memoized = memoize(fn, fn);
    const object = { memoized: memoized, b: 2, c: 3 };

    expect(object.memoized(1)).toEqual(6);
    object.b = 3;
    object.c = 5;

    expect(object.memoized(1)).toEqual(9);
  });

  it('should check cache for own properties', () => {
    const props = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ];

    function identity<T>(value: T): T {
      return value;
    }

    const memoized = memoize(identity);

    const values = props.map(value => memoized(value));

    expect(values).toEqual(props);
  });

  it('should cache the `__proto__` key', () => {
    const array = [];
    const key = '__proto__';

    function identity<T>(value: T): T {
      return value;
    }

    [0, 1].forEach((value, index): void => {
      let count = 0;
      const resolver = index ? identity : undefined;

      const memoized = memoize(() => {
        count++;
        return array;
      }, resolver);

      const cache = memoized.cache;

      memoized(key);
      memoized(key);

      expect(count).toEqual(1);
      expect(cache.get(key)).toEqual(array);
      expect(cache.delete(key)).toEqual(true);
    });
  });
});

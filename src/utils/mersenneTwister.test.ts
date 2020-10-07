import { MersenneTwister } from './mersenneTwister';

describe('MersenneTwister', () => {
  it('Should repeat random sequence on same seed', () => {
    const g = new MersenneTwister();

    const seed = 123;

    g.initSeed(seed);
    const first1 = g.random();
    const first2 = g.random();

    g.initSeed(seed);
    const second1 = g.random();
    const second2 = g.random();

    expect(first1).toEqual(second1);
    expect(first2).toEqual(second2);
  });

  it('Should allow seeding via constructor', () => {
    const seed = 325;
    const g1 = new MersenneTwister(seed);
    const g2 = new MersenneTwister(seed);

    for (let i = 0; i < 5; ++i) {
      expect(g1.random()).toEqual(g2.random());
    }
  });

  it('Should roughly match Python when seeded by array', () => {
    const seed1 = 0;
    const seed2 = 42;

    const g1 = new MersenneTwister([seed1]);
    const g2 = new MersenneTwister([seed2]);

    /* We should get a near exact match with Python's rng
                 * when we seed by array.  The code for generating
                 * these comparison values is something like:
                 import random
                 r = random.Random(0)
                 for i in range(10000000):
                     x = r.random()
                     if i % 1000000 == 0: print(x)
                */
    const values1 = [0.84442, 0.34535, 0.2557, 0.32368, 0.89075];
    const values2 = [0.63942, 0.55564, 0.55519, 0.81948, 0.94333];

    for (let i = 0; i < 5000000; i++) {
      const rval1 = g1.randomLong();
      const rval2 = g2.randomLong();

      if (i % 1000000 === 0) {
        const idx = i / 1000000;
        expect(rval1).toBeCloseTo(values1[idx], 4);
        expect(rval2).toBeCloseTo(values2[idx], 4);
      }
    }
  });
});

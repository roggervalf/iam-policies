import { MersenneTwister } from './mersenneTwister';

/**
 * uuid
 *
 * @method faker.random.uuid
 */
const replacePlaceholders = (placeholder: string): string => {
  const mersenne = new MersenneTwister();
  const random = Math.floor(mersenne.randomInt() * (1.0 / 4294967296.0) * 15);
  // Workaround problem in Float point arithmetics for e.g. 6681493 / 0.01

  const value = placeholder === 'x' ? random : (random & 0x3) | 0x8;
  return value.toString(16);
};

export function generateUUID(): string {
  const RFC4122_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  return RFC4122_TEMPLATE.replace(/[xy]/g, replacePlaceholders);
}

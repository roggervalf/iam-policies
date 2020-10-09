import { MersenneTwister } from './mersenneTwister';

const replacePlaceholders = (placeholder: string): string => {
  const mersenne = new MersenneTwister();
  const random = Math.floor(mersenne.randomInt32() * (1.0 / 4294967296.0) * 15);
  // Workaround problem in Float point arithmetics for e.g. 6681493 / 0.01

  const value = placeholder === 'x' ? random : (random & 0x3) | 0x8;
  return value.toString(16);
};

/**
 * Generate a uuid.
 *
 * @private
 * @since 3.5.0
 * @returns {string} Returns the generated uuid.
 * @example
 * ```javascript
 * generateUUID()
 * // => 84cc8800-6000-4555-844b-bbb333888888
 *
 * generateUUID()
 * // => 3dd002aa-2111-4000-b333-777666666666
 * ```
 */
export function generateUUID(): string {
  const RFC4122_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  return RFC4122_TEMPLATE.replace(/[xy]/g, replacePlaceholders);
}

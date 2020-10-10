import { MersenneTwister } from './mersenneTwister';

const replacePlaceholders = (mersenne: MersenneTwister) => (
  placeholder: string
): string => {
  const random = Math.floor(mersenne.randomReal2() * 16);

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
 * // => 49e71c40-9b21-4371-9699-2def33f62e66
 *
 * generateUUID()
 * // => da94f128-4247-48e3-bc73-d0cae46b5093
 * ```
 */
export function generateUUID(): string {
  const mersenne = new MersenneTwister();
  const RFC4122_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  return RFC4122_TEMPLATE.replace(/[xy]/g, replacePlaceholders(mersenne));
}

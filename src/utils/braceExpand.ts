import { decomposeString } from './decomposeString';

/**
 * Generate an array of string depending on {} blocks.
 *
 * @param {string} pattern Pattern string that can contains {} blocks.
 * @returns {string[]} Returns an array of string with all the combinations.
 * @example
 * ```javascript
 * braceExpand('${13}')
 * // => ['{13}']
 *
 * braceExpand('a{b,f,m}p')
 * // => ['abp','afp','amp']
 *
 * braceExpand('-v{,,}')
 * // => ['-v','-v','-v']
 * ```
 */
const braceExpand = (pattern: string): string[] => {
  if (!pattern.match(/{.*}/)) {
    return [pattern];
  }

  return expand(pattern, true);
};

const expand = (str: string, isTop?: boolean): string[] => {
  const expansions = [] as string[];
  const balance = decomposeString('{', '}', str);
  if (balance.start < 0) return [str];

  const parts = balance.body.split(',');
  // no need to expand pre, since it is guaranteed to be free of brace-sets
  const pre = balance.pre;
  const postParts = balance.post.length ? expand(balance.post, false) : [''];

  if (/\$$/.test(pre) && !/\\\$$/.test(pre)) {
    postParts.forEach((postPart) => {
      const expansion = `${pre.slice(0, -1)}{${balance.body}}${postPart}`;
      expansions.push(expansion);
    });
  } else {
    const newPre = /\\\$$/.test(pre)
      ? `${pre.substring(0, pre.length - 2)}$`
      : pre;
    parts.forEach((part: string) => {
      postParts.forEach((postPart) => {
        const expansion = newPre + part + postPart;
        if (!isTop || expansion) expansions.push(expansion);
      });
    });
  }

  return expansions;
};

export { braceExpand };

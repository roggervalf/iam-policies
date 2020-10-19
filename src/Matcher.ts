import { decomposeString } from './utils/decomposeString';

export class Matcher {
  private readonly pattern: string;
  private readonly maxLength: number;
  private readonly set: (string | RegExp)[];
  private readonly empty: boolean;

  constructor(pattern: string, maxLength = 1024 * 64) {
    this.set = [];
    this.pattern = pattern.trim();
    this.maxLength = maxLength;
    this.empty = !this.pattern ? true : false;

    const set = this.braceExpand();
    this.set = set.map((val) => this.parse(val));
    this.set = this.set.filter((s) => {
      return Boolean(s);
    });
  }

  private braceExpand(): string[] {
    const pattern = this.pattern;
    if (!pattern.match(/{.*}/)) {
      return [pattern];
    }

    return this.expand(pattern, true);
  }

  private parse(pattern: string): string | RegExp {
    if (pattern.length > this.maxLength) {
      throw new TypeError('Pattern is too long');
    }
    let regExp;
    let hasSpecialCharacter = false;
    if (pattern === '') return '';

    const re = pattern.replace(/\*/g, () => {
      hasSpecialCharacter = true;
      return '.+?';
    });

    // skip the regexp for non-* patterns
    // unescape anything in it, though, so that it'll be
    // an exact match.
    if (!hasSpecialCharacter) {
      return pattern.replace(/\\(.)/g, '$1');
    }

    try {
      regExp = new RegExp('^' + re + '$');
    } catch (error) {
      // If it was an invalid regular expression, then it can't match
      // anything.
      return new RegExp('$.');
    }

    return regExp;
  }

  private expand(str: string, isTop?: boolean): string[] {
    const expansions = [] as string[];
    const balance = decomposeString('{', '}', str);
    if (balance.start < 0 || /\$$/.test(balance.pre)) return [str];

    const parts = balance.body.split(',');
    // no need to expand pre, since it is guaranteed to be free of brace-sets
    const pre = balance.pre;
    const postParts = balance.post.length
      ? this.expand(balance.post, false)
      : [''];

    parts.forEach((part: string) => {
      postParts.forEach((postPart) => {
        const expansion = pre + part + postPart;
        if (!isTop || expansion) expansions.push(expansion);
      });
    });

    return expansions;
  }

  match(str: string): boolean {
    if (this.empty) return str === '';

    return this.set.some((pattern) => this.matchOne(str, pattern));
  }

  private matchOne(str: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
      return str === pattern;
    }

    return Boolean(str.match(pattern));
  }
}

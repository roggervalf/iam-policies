import { braceExpand } from './utils/braceExpand';

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

    const set = braceExpand(pattern);
    this.set = set.map((val) => this.parse(val));
    this.set = this.set.filter((s) => {
      return Boolean(s);
    });
  }

  match(this: Matcher, str: string): boolean {
    if (this.empty) return str === '';

    return this.set.some((pattern) => this.matchOne(str, pattern));
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

  private matchOne(str: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
      return str === pattern;
    }

    return Boolean(str.match(pattern));
  }
}

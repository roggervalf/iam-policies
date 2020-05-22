import { decomposeString } from './utils/decomposeString';

export class Matcher {
  private readonly pattern: string;
  private readonly set: (string | RegExp)[];
  private readonly empty: boolean;
  private hasSpecialCharacter: boolean;

  constructor(pattern: string) {
    this.set = [];
    this.pattern = pattern.trim();
    this.empty = !this.pattern ? true : false;
    this.hasSpecialCharacter = false;

    const set = this.braceExpand();
    this.set = set.map(val => this.parse(val));
    this.set = this.set.filter(s => {
      return Boolean(s);
    });
  }

  private braceExpand(): string[] {
    let pattern = this.pattern;
    if (!pattern.match(/{.*}/)) {
      return [pattern];
    }
    // I don't know why Bash 4.3 does this, but it does.
    // Anything starting with {} will have the first two bytes preserved
    // but only at the top level, so {},a}b will not expand to anything,
    // but a{},b}c will be expanded to [a}c,abc].
    // One could argue that this is a bug in Bash, but since the goal of
    // this module is to match Bash's rules, we escape a leading {}
    if (pattern.substr(0, 2) === '{}') {
      pattern = '\\{\\}' + pattern.substr(2);
    }

    return this.expand(pattern, true);
  }

  private parse(pattern: string): string | RegExp {
    if (pattern.length > 1024 * 64) {
      throw new TypeError('pattern is too long');
    }
    let regExp,
      re = '';
    if (pattern === '') return '';

    for (
      let i = 0, len = pattern.length, c;
      i < len && (c = pattern.charAt(i));
      i++
    ) {
      if (c === '*') {
        this.hasSpecialCharacter = true;
        re += '.*?';
      } else {
        re += c;
      }
    }

    // if the re is not '' at this point, then we need to make sure
    // it doesn't match against an empty path part.
    // Otherwise a/* will match a/, which it should not.
    if (re !== '' && this.hasSpecialCharacter) {
      re = '(?=.)' + re;
    }

    // skip the regexp for non-* patterns
    // unescape anything in it, though, so that it'll be
    // an exact match.
    if (!this.hasSpecialCharacter) {
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
    let parts;

    if (!balance.body) parts = [''];
    else parts = balance.body.split(',');

    // no need to expand pre, since it is guaranteed to be free of brace-sets
    const pre = balance.pre;
    const postParts = balance.post.length
      ? this.expand(balance.post, false)
      : [''];

    parts.forEach(part => {
      postParts.forEach(postPart => {
        const expansion = pre + part + postPart;
        if (!isTop || expansion) expansions.push(expansion);
      });
    });

    return expansions;
  }

  match(str: string): boolean {
    if (this.empty) return str === '';

    const set = this.set;

    return set.some(pattern => this.matchOne(str, pattern));
  }

  private matchOne(str: string, pattern: string | RegExp): boolean {
    if (!pattern) return false;

    if (typeof pattern === 'string') {
      return str === pattern;
    }

    return Boolean(str.match(pattern));
  }
}

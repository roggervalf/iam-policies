'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Gets the `toStringTag` of `value`.
 *
 * @since 3.1.0
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 * @example
 * ```javascript
 * getTag(1)
 * // => '[object Number]'
 *
 * getTag(null)
 * // => '[object Null]'
 * ```
 */
function getTag(value) {
    return Object.prototype.toString.call(value);
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @since 3.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 * ```javascript
 * isSymbol(Symbol())
 * // => true
 *
 * isSymbol('abc')
 * // => false
 * ```
 */
function isSymbol(value) {
    const type = typeof value;
    return (type === 'symbol' ||
        (type === 'object' && value !== null && getTag(value) === '[object Symbol]'));
}

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0;
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @since 3.1.0
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 * @example
 *
 * toKey(Symbol.iterator)
 * // => true
 *
 * toKey('abc')
 * // => false
 */
function toKey(value) {
    if (typeof value === 'string' || isSymbol(value)) {
        return value;
    }
    return value === 0 && 1 / value === -INFINITY ? '-0' : `${value}`;
}

/** Used to match property names within property paths. */
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/; //matches any word character (alphanumeric and underscore)
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @since 3.1.0
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 * @example
 * ```javascript
 * isKey(1)
 * // => true
 *
 * isKey('example[test]')
 * // => false
 *
 * isKey('a.b')
 * // => false
 *
 * const obj = {
 *   '[a]': 5,
 *   'b.c': true
 * };
 *
 * isKey('[a]', obj)
 * // => true
 *
 * isKey('b.c', obj)
 * // => true
 * ```
 */
function isKey(value, object) {
    const type = typeof value;
    if (type === 'number' ||
        type === 'boolean' ||
        value === null ||
        value === undefined ||
        isSymbol(value)) {
        return true;
    }
    if (typeof value === 'string') {
        return (reIsPlainProp.test(value) ||
            !reIsDeepProp.test(value) ||
            (object !== null && value in Object(object)));
    }
    return false;
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * @since 3.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 * ```javascript
 * const object = { 'a': 1, 'b': 2 }
 * const other = { 'c': 3, 'd': 4 }
 *
 * const values = memoize(values)
 * values(object)
 * // => [1, 2]
 *
 * values(other)
 * // => [3, 4]
 *
 * object.a = 2
 * values(object)
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b'])
 * values(object)
 * // => ['a', 'b']
 * ```
 */
function memoize(func, resolver) {
    const memoized = function (...args) {
        const key = resolver ? resolver.apply(this, args) : args[0];
        const cache = memoized.cache;
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };
    memoized.cache = new Map();
    return memoized;
}
/*const memoize = (fn: Function): Function => {
  const cache = {};
  return (...args): any => {
    const stringifiedArgs = JSON.stringify(args);
    const result = (cache[stringifiedArgs] =
      typeof cache[stringifiedArgs] === 'undefined'
        ? fn(...args)
        : cache[stringifiedArgs]);
    return result;
  };
};*/

/** Used as the maximum memoize cache size. */
const MAX_MEMOIZE_SIZE = 500;
/**
 * A specialized version of `memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @since 3.1.0
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
    const result = memoize(func, (key) => {
        const { cache } = result;
        if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
        }
        return key;
    });
    return result;
}

const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
// Match anything that isn't a dot or bracket.
'[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\x02)[^\\\\]|\\\\.)*?)\\x02' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g');
/**
 * Converts `string` to a property path array.
 *
 * @since 3.1.0
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
const stringToPath = memoizeCapped((string) => {
    const result = [];
    if (string.charCodeAt(0) === charCodeOfDot) {
        result.push('');
    }
    string.replace(rePropName, (match, expression, quote, subString) => {
        let key = match;
        if (quote) {
            key = subString.replace(reEscapeChar, '$1');
        }
        else if (expression) {
            key = expression.trim();
        }
        result.push(key);
        return '';
    });
    return result;
});

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
    if (Array.isArray(value)) {
        return value;
    }
    return isKey(value, object) ? [value] : stringToPath(value);
}
/**
 * The base implementation of `get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
    const newPath = castPath(path, object);
    let index = 0;
    const length = newPath.length;
    let value = object;
    while (value instanceof Object && index < length) {
        value = value[toKey(newPath[index++])];
    }
    return index && index === length ? value : undefined;
}
/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @since 3.1.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
 *
 * getValueFromPath(object, 'a[0].b.c')
 * // => 3
 *
 * getValueFromPath(object, ['a', '0', 'b', 'c'])
 * // => 3
 *
 * getValueFromPath(object, 'a.b.c', 'default')
 * // => 'default'
 */
function getValueFromPath(object, path, defaultValue) {
    const result = object === null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
}

const reDelimiters = /\${([^}]*)}/g;
const trim = / +(?= )|^\s+|\s+$/g;
const specialTrim = (str) => str.replace(trim, '');
/**
 * Apply the context value in a string.
 *
 * @param {string} str Pattern string, containing context path.
 * @param {object} context Object to get values from path.
 * @returns {string} Returns a string with embedded context values.
 * @example
 * ```javascript
 * const context = {
 *   user: { id: 456, bestFriends: [123, 532, 987] }
 * };
 * applyContext('secrets:${user.id}:*', context)
 * // => 'secrets:456:*'
 *
 * applyContext('secrets:${user.bestFriends}:*', context)
 * // => 'secrets:{123,532,987}:*'
 *
 * applyContext('secrets:${company.address}:account', context)
 * // => 'secrets:undefined:account'
 * ```
 */
function applyContext(str, context) {
    if (!context)
        return str;
    return specialTrim(str.replace(reDelimiters, (_, path) => {
        const value = getValueFromPath(context, path);
        if (Array.isArray(value))
            return `{${value}}`;
        if (value instanceof Object)
            return 'undefined';
        return String(value);
    }));
}

/**
 * Get index range where separators are found.
 *
 * @private
 * @since 3.1.1
 * @param {string} initialSeparator First string to be found.
 * @param {string} finalSeparator Second string to be found.
 * @param {string} str String to be decomposed.
 * @returns {number[]} Returns the beginning and final index for those matches.
 * @example
 * ```javascript
 * getIndexRange('first', 'Second', 'firstAndSecond')
 * // => [0, 8]
 *
 * getIndexRange('First', 'Second', '++FirstAndSecond**')
 * // => [2, 10]
 * ```
 */
function getIndexRange(initialSeparator, finalSeparator, str) {
    const beginningIndex = str.indexOf(initialSeparator);
    const finalIndex = str.indexOf(finalSeparator, beginningIndex + 1);
    if (beginningIndex >= 0 && finalIndex > 0) {
        return [beginningIndex, finalIndex];
    }
    return [-1, -1];
}
/**
 * Object returned by decomposeString function
 *
 * @typedef {Object} DecomposedString
 * @property {number} start Beginning index for first separator match
 * @property {number} end Final index for second separator match
 * @property {string} pre Substring before first separator
 * @property {string} body Substring between separators
 * @property {string} post Substring after second separator
 */
/**
 * Decompose string in pre, body and post strings by using separators.
 *
 * @private
 * @since 3.1.1
 * @param {string} initialSeparator First string to be found.
 * @param {string} finalSeparator Second string to be found.
 * @param {string} str String to be decomposed.
 * @returns {DecomposedString} Returns a decompose string.
 * @example
 * ```javascript
 * decomposeString('first', 'Second', 'firstAndSecond')
 * // => { start: 0, end: 8, pre: '', body: 'And', post: '' }
 *
 * decomposeString('First', 'Second', '++FirstAndSecond**')
 * // => { start: 2, end: 10, pre: '++', body: 'And', post: '**' }
 * ```
 */
function decomposeString(initialSeparator, finalSeparator, str) {
    const [beginningIndex, finalIndex] = getIndexRange(initialSeparator, finalSeparator, str);
    return {
        start: beginningIndex,
        end: finalIndex,
        pre: beginningIndex >= 0 ? str.slice(0, beginningIndex) : '',
        body: beginningIndex >= 0
            ? str.slice(beginningIndex + initialSeparator.length, finalIndex)
            : '',
        post: beginningIndex >= 0 ? str.slice(finalIndex + finalSeparator.length) : ''
    };
}

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
const braceExpand = (pattern) => {
    if (!pattern.match(/{.*}/)) {
        return [pattern];
    }
    return expand(pattern, true);
};
const expand = (str, isTop) => {
    const expansions = [];
    const balance = decomposeString('{', '}', str);
    if (balance.start < 0)
        return [str];
    const parts = balance.body.split(',');
    // no need to expand pre, since it is guaranteed to be free of brace-sets
    const pre = balance.pre;
    const postParts = balance.post.length ? expand(balance.post, false) : [''];
    if (/\$$/.test(balance.pre)) {
        postParts.forEach((postPart) => {
            const expansion = `${balance.pre.slice(0, -1)}{${balance.body}}${postPart}`;
            expansions.push(expansion);
        });
    }
    else {
        parts.forEach((part) => {
            postParts.forEach((postPart) => {
                const expansion = pre + part + postPart;
                if (!isTop || expansion)
                    expansions.push(expansion);
            });
        });
    }
    return expansions;
};

class Matcher {
    constructor(pattern, maxLength = 1024 * 64) {
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
    match(str) {
        if (this.empty)
            return str === '';
        return this.set.some((pattern) => this.matchOne(str, pattern));
    }
    parse(pattern) {
        if (pattern.length > this.maxLength) {
            throw new TypeError('Pattern is too long');
        }
        let regExp;
        let hasSpecialCharacter = false;
        if (pattern === '')
            return '';
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
        }
        catch (error) {
            // If it was an invalid regular expression, then it can't match
            // anything.
            return new RegExp('$.');
        }
        return regExp;
    }
    matchOne(str, pattern) {
        if (typeof pattern === 'string') {
            return str === pattern;
        }
        return Boolean(str.match(pattern));
    }
}

/*
  https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over each other's state.
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  var m = new MersenneTwister();
  var randomNumber = m.random();
  You can also call the other genrand_{foo}() methods on the instance.
  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:
  var m = new MersenneTwister(123);
  and that will always produce the same random sequence.
  Sean McCullough (banksean@gmail.com)
*/
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
   Before using, initialize the state by using init_seed(seed)
   or init_by_array(init_key, key_length).
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
class MersenneTwister {
    constructor(seed) {
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df; /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */
        if (Array.isArray(seed)) {
            if (seed.length > 0)
                this.initByArray(seed, seed.length);
        }
        else {
            if (seed === undefined) {
                this.initSeed(new Date().getTime());
            }
            else {
                this.initSeed(seed);
            }
        }
    }
    /* initializes mt[N] with a seed */
    /* origin name init_genrand */
    initSeed(seed) {
        this.mt[0] = seed >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] =
                ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                    (s & 0x0000ffff) * 1812433253 +
                    this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    }
    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    initByArray(initKey, keyLength) {
        this.initSeed(19650218);
        let i = 1;
        let j = 0;
        let k = this.N > keyLength ? this.N : keyLength;
        for (; k; k--) {
            const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] =
                (this.mt[i] ^
                    (((((s & 0xffff0000) >>> 16) * 1664525) << 16) +
                        (s & 0x0000ffff) * 1664525)) +
                    initKey[j] +
                    j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
            if (j >= keyLength)
                j = 0;
        }
        for (k = this.N - 1; k; k--) {
            const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] =
                (this.mt[i] ^
                    (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) +
                        (s & 0x0000ffff) * 1566083941)) -
                    i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
        }
        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    }
    /* generates a random number on [0,0xffffffff]-interval */
    /* origin name genrand_int32 */
    randomInt32() {
        let y;
        const mag01 = [0x0, this.MATRIX_A];
        /* mag01[x] = x * MATRIX_A  for x=0,1 */
        if (this.mti >= this.N) {
            /* generate N words at one time */
            let kk;
            if (this.mti === this.N + 1)
                /* if init_seed() has not been called, */
                this.initSeed(5489); /* a default initial seed is used */
            for (kk = 0; kk < this.N - this.M; kk++) {
                y =
                    (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y =
                    (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] =
                    this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y =
                (this.mt[this.N - 1] & this.UPPER_MASK) |
                    (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
            this.mti = 0;
        }
        y = this.mt[this.mti++];
        /* Tempering */
        y ^= y >>> 11;
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= y >>> 18;
        return y >>> 0;
    }
    /* generates a random number on [0,0x7fffffff]-interval */
    /* origin name genrand_int31 */
    randomInt31() {
        return this.randomInt32() >>> 1;
    }
    /* generates a random number on [0,1]-real-interval */
    /* origin name genrand_real1 */
    randomReal1() {
        return this.randomInt32() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    }
    /* generates a random number on [0,1)-real-interval */
    /* origin name genrand_real2 */
    randomReal2() {
        return this.randomInt32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }
    /* generates a random number on (0,1)-real-interval */
    /* origin name genrand_real3 */
    randomReal3() {
        return (this.randomInt32() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }
    /* generates a random number on [0,1) with 53-bit resolution*/
    /* origin name genrand_res53 */
    randomRes53() {
        const a = this.randomInt32() >>> 5;
        const b = this.randomInt32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
}
/* These real versions are due to Isaku Wada, 2002/01/09 added */

const replacePlaceholders = (mersenne) => (placeholder) => {
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
function generateUUID() {
    const mersenne = new MersenneTwister();
    const RFC4122_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return RFC4122_TEMPLATE.replace(/[xy]/g, replacePlaceholders(mersenne));
}

/**
 * Boolean matching.
 *
 * @since 4.7.0
 * @category Boolean
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * bool(true, true)
 * // => true
 *
 * bool(true, false)
 * // => false
 * ```
 */
function bool(data, expected) {
    return (data === expected);
}

const convertDate = (date) => {
    if (date instanceof Date) {
        return date.getTime();
    }
    return Date.parse(date);
};

/**
 * Exact date matching.
 *
 * @since 4.8.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * dateEquals('December 15, 1994 03:24:00', 'December 15, 1994 03:24:00')
 * // => true
 *
 * dateEquals('December 15, 2000 03:24:00', 'December 10, 2001 03:24:00')
 * // => false
 * ```
 */
function dateEquals(data, expected) {
    const convertedData = convertDate(data);
    const convertedExpectation = convertDate(expected);
    return (convertedData === convertedExpectation);
}

/**
 * Matching after a specific date and time
 *
 * @since 4.11.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is after than `expected value`.
 * @example
 * ```javascript
 * dateGreaterThan('December 17, 1994 03:24:00', 'December 16, 1994 03:24:00')
 * // => true
 *
 * dateGreaterThan('December 15, 2000 03:24:00', 'December 15, 2000 03:24:00')
 * // => false
 * ```
 */
function dateGreaterThan(data, expected) {
    const convertedData = convertDate(data);
    const convertedExpectation = convertDate(expected);
    return convertedData > convertedExpectation;
}

/**
 * Matching at or after a specific date and time
 *
 * @since 4.11.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is after than or equals `expected value`.
 * @example
 * ```javascript
 * dateGreaterThanEquals('December 17, 1994 03:24:00', 'December 16, 1994 03:24:00')
 * // => true
 *
 * dateGreaterThanEquals('December 15, 2000 03:24:00', 'December 15, 2000 03:25:00')
 * // => false
 * ```
 */
function dateGreaterThanEquals(data, expected) {
    const convertedData = convertDate(data);
    const convertedExpectation = convertDate(expected);
    return convertedData >= convertedExpectation;
}

/**
 * Matching before a specific date and time
 *
 * @since 4.10.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is before than `expected value`.
 * @example
 * ```javascript
 * dateLessThan('December 15, 1994 03:24:00', 'December 16, 1994 03:24:00')
 * // => true
 *
 * dateLessThan('December 15, 2000 03:24:00', 'December 15, 2000 03:24:00')
 * // => false
 * ```
 */
function dateLessThan(data, expected) {
    const convertedData = convertDate(data);
    const convertedExpectation = convertDate(expected);
    return (convertedData < convertedExpectation);
}

/**
 * Matching at or before a specific date and time
 *
 * @since 4.10.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal or before than `expected value`.
 * @example
 * ```javascript
 * dateLessThanEquals('December 15, 1994 03:24:00', 'December 15, 1994 03:24:00')
 * // => true
 *
 * dateLessThanEquals('December 15, 2000 03:24:00', 'December 15, 2000 03:24:00')
 * // => false
 * ```
 */
function dateLessThanEquals(data, expected) {
    const convertedData = convertDate(data);
    const convertedExpectation = convertDate(expected);
    return (convertedData <= convertedExpectation);
}

/**
 * Negated date matching.
 *
 * @since 4.9.0
 * @category Date
 * @param {Date} data The value to be compared.
 * @param {Date} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * dateNotEquals('December 15, 1994 03:24:00', 'December 16, 1995 03:24:00')
 * // => true
 *
 * dateNotEquals('December 15, 2000 03:24:00', 'December 15, 2000 03:24:00')
 * // => false
 * ```
 */
function dateNotEquals(data, expected) {
    const convertedData = convertDate(data);
    const convertedExpectation = convertDate(expected);
    return (convertedData !== convertedExpectation);
}

/**
 * Exact numeric matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * numericEquals(5, 5)
 * // => true
 *
 * numericEquals(2, 4)
 * // => false
 * ```
 */
function numericEquals(data, expected) {
    return (data === expected);
}

/**
 * Numeric greater than matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is greater than `expected value`.
 * @example
 * ```javascript
 * numericGreaterThan(6, 5)
 * // => true
 *
 * numericGreaterThan(4, 8)
 * // => false
 * ```
 */
function numericGreaterThan(data, expected) {
    return (data > expected);
}

/**
 * Numeric greater than or equals matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is greater than or equals `expected value`.
 * @example
 * ```javascript
 * numericGreaterThanEquals(5, 5)
 * // => true
 *
 * numericGreaterThanEquals(4, 8)
 * // => false
 * ```
 */
function numericGreaterThanEquals(data, expected) {
    return (data >= expected);
}

/**
 * Numeric less than matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is less than `expected value`.
 * @example
 * ```javascript
 * numericLessThan(5, 6)
 * // => true
 *
 * numericLessThan(8, 4)
 * // => false
 * ```
 */
function numericLessThan(data, expected) {
    return (data < expected);
}

/**
 * Numeric less than or equals matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is less than or equals `expected value`.
 * @example
 * ```javascript
 * numericLessThanEquals(5, 5)
 * // => true
 *
 * numericLessThanEquals(8, 4)
 * // => false
 * ```
 */
function numericLessThanEquals(data, expected) {
    return (data <= expected);
}

/**
 * Negated numeric matching.
 *
 * @since 4.6.0
 * @category Numeric
 * @param {number} data The value to be compared.
 * @param {number} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * numericNotEquals(2, 4)
 * // => true
 *
 * numericNotEquals(5, 5)
 * // => false
 * ```
 */
function numericNotEquals(data, expected) {
    return (data !== expected);
}

/**
 * Exact string matching, case sensitive.
 *
 * @since 4.3.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * stringEquals('hi', 'hi')
 * // => true
 *
 * stringEquals('hi', 'no')
 * // => false
 * ```
 */
function stringEquals(data, expected) {
    return (data === expected);
}

/**
 * Exact string matching, ignoring case.
 *
 * @since 4.4.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal to `expected value`.
 * @example
 * ```javascript
 * stringEqualsIgnoreCase('hi', 'Hi')
 * // => true
 *
 * stringEqualsIgnoreCase('hi', 'no')
 * // => false
 * ```
 */
function stringEqualsIgnoreCase(data, expected) {
    return (data.toLowerCase() === expected.toLowerCase());
}

/**
 * Case-sensitive matching. The values can include a multi-character match wildcard (*) anywhere in the string.
 *
 * @since 4.5.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal like `expected value`.
 * @example
 * ```javascript
 * stringLike('newHouse', 'new*')
 * // => true
 *
 * stringLike('House', 'new*')
 * // => false
 * ```
 */
function stringLike(data, expected) {
    return (new Matcher(data).match(expected));
}

/**
 * Case-sensitive matching if exist. The values can include a multi-character match wildcard (*) anywhere in the string.
 *
 * @since 4.12.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is equal like `expected value` or if it does not exist.
 * @example
 * ```javascript
 * stringLikeIfExists(undefined, 'new*')
 * // => true
 *
 * stringLikeIfExists('House', 'new*')
 * // => false
 * ```
 */
function stringLikeIfExists(data, expected) {
    return data ? (stringLike(data, expected)) : true;
}

/**
 * Negated string matching.
 *
 * @since 4.4.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * stringNotEquals('hi', 'no')
 * // => true
 *
 * stringNotEquals('hi', 'hi')
 * // => false
 * ```
 */
function stringNotEquals(data, expected) {
    return (data !== expected);
}

/**
 * Negated string matching, ignoring case.
 *
 * @since 4.4.0
 * @category String
 * @param {string} data The value to be compared.
 * @param {string} expected The expected value.
 * @returns {boolean} Returns `true` if `value` is not equal to `expected value`.
 * @example
 * ```javascript
 * stringNotEqualsIgnoreCase('hi', 'no')
 * // => true
 *
 * stringNotEqualsIgnoreCase('hi', 'Hi')
 * // => false
 * ```
 */
function stringNotEqualsIgnoreCase(data, expected) {
    return (data.toLowerCase() !== expected.toLowerCase());
}

const operators = {
    bool,
    dateEquals,
    dateGreaterThan,
    dateGreaterThanEquals,
    dateLessThan,
    dateLessThanEquals,
    dateNotEquals,
    numericEquals,
    numericGreaterThan,
    numericGreaterThanEquals,
    numericLessThan,
    numericLessThanEquals,
    numericNotEquals,
    stringEquals,
    stringEqualsIgnoreCase,
    stringLike,
    stringLikeIfExists,
    stringNotEquals,
    stringNotEqualsIgnoreCase
};

class Statement {
    constructor({ sid, effect = 'allow', condition }) {
        if (!sid) {
            this.sid = generateUUID();
        }
        else {
            this.sid = sid;
        }
        this.effect = effect;
        this.condition = condition;
    }
    matchConditions({ context, conditionResolver }) {
        const { condition: conditions } = this;
        if (conditions && context) {
            return Object.keys(conditions).every((condition) => Object.keys(conditions[condition]).every((path) => {
                const conditionValues = conditions[condition][path];
                if (conditionValues instanceof Array) {
                    return conditionValues.some((value) => this.evaluateCondition({
                        context,
                        conditionResolver,
                        condition,
                        path,
                        value
                    }));
                }
                return this.evaluateCondition({
                    context,
                    conditionResolver,
                    condition,
                    path,
                    value: conditionValues
                });
            }));
        }
        return true;
    }
    evaluateCondition({ context, conditionResolver = {}, path, value, condition }) {
        const currentResolver = conditionResolver[condition] || operators[condition];
        if (currentResolver) {
            return currentResolver(getValueFromPath(context, path), value);
        }
        return false;
    }
}

class ActionBased extends Statement {
    constructor(action) {
        super(action);
        this.checkAndAssignActions(action);
        this.statement = Object.assign(Object.assign({}, action), { sid: this.sid });
    }
    getStatement() {
        return this.statement;
    }
    matches({ action, context, conditionResolver }) {
        return (this.matchActions(action, context) &&
            this.matchNotActions(action, context) &&
            this.matchConditions({ context, conditionResolver }));
    }
    checkAndAssignActions(action) {
        const hasAction = 'action' in action;
        const hasNotAction = 'notAction' in action;
        if (hasAction && hasNotAction) {
            throw new TypeError('ActionBased statement should have an action or a notAction attribute, no both');
        }
        if ('action' in action) {
            this.action =
                typeof action.action === 'string' ? [action.action] : action.action;
        }
        else {
            this.notAction =
                typeof action.notAction === 'string'
                    ? [action.notAction]
                    : action.notAction;
        }
    }
    matchActions(action, context) {
        return this.action
            ? this.action.some((a) => new Matcher(applyContext(a, context)).match(action))
            : true;
    }
    matchNotActions(action, context) {
        return this.notAction
            ? !this.notAction.some((a) => new Matcher(applyContext(a, context)).match(action))
            : true;
    }
}

class IdentityBased extends Statement {
    constructor(identity) {
        super(identity);
        this.checkAndAssignActions(identity);
        this.checkAndAssignResources(identity);
        this.statement = Object.assign(Object.assign({}, identity), { sid: this.sid });
    }
    getStatement() {
        return this.statement;
    }
    matches({ action, resource, context, conditionResolver }) {
        return (this.matchActions(action, context) &&
            this.matchNotActions(action, context) &&
            this.matchResources(resource, context) &&
            this.matchNotResources(resource, context) &&
            this.matchConditions({ context, conditionResolver }));
    }
    checkAndAssignActions(identity) {
        const hasAction = 'action' in identity;
        const hasNotAction = 'notAction' in identity;
        if (hasAction && hasNotAction) {
            throw new TypeError('IdentityBased statement should have an action or a notAction attribute, no both');
        }
        if ('action' in identity) {
            this.action =
                typeof identity.action === 'string'
                    ? [identity.action]
                    : identity.action;
        }
        else {
            this.notAction =
                typeof identity.notAction === 'string'
                    ? [identity.notAction]
                    : identity.notAction;
        }
    }
    checkAndAssignResources(identity) {
        const hasResource = 'resource' in identity;
        const hasNotResource = 'notResource' in identity;
        if (hasResource && hasNotResource) {
            throw new TypeError('IdentityBased statement should have a resource or a notResource attribute, no both');
        }
        if ('resource' in identity) {
            this.resource =
                typeof identity.resource === 'string'
                    ? [identity.resource]
                    : identity.resource;
        }
        else {
            this.notResource =
                typeof identity.notResource === 'string'
                    ? [identity.notResource]
                    : identity.notResource;
        }
    }
    matchActions(action, context) {
        return this.action
            ? this.action.some((a) => new Matcher(applyContext(a, context)).match(action))
            : true;
    }
    matchNotActions(action, context) {
        return this.notAction
            ? !this.notAction.some((a) => new Matcher(applyContext(a, context)).match(action))
            : true;
    }
    matchResources(resource, context) {
        return this.resource
            ? this.resource.some((a) => new Matcher(applyContext(a, context)).match(resource))
            : true;
    }
    matchNotResources(resource, context) {
        return this.notResource
            ? !this.notResource.some((a) => new Matcher(applyContext(a, context)).match(resource))
            : true;
    }
}

class ResourceBased extends Statement {
    constructor(identity) {
        super(identity);
        this.hasPrincipals = false;
        this.hasResources = false;
        this.checkAndAssignActions(identity);
        this.checkAndAssignPrincipals(identity);
        this.checkAndAssignResources(identity);
        this.statement = Object.assign(Object.assign({}, identity), { sid: this.sid });
    }
    getStatement() {
        return this.statement;
    }
    matches({ principal, action, resource, principalType, context, conditionResolver }) {
        return (this.matchPrincipalAndNotPrincipal(principal, principalType, context) &&
            this.matchActions(action, context) &&
            this.matchNotActions(action, context) &&
            this.matchResourceAndNotResource(resource, context) &&
            this.matchConditions({ context, conditionResolver }));
    }
    /*valueComing principal noPrincipal
    true        false     false       false
    true        true      false       true or false
    true        false     true        true or false
    false       false     false       true
    false       true      false       false
    false       false     true        false*/
    matchPrincipalAndNotPrincipal(principal, principalType, context) {
        if (principal) {
            if (this.hasPrincipals)
                return (this.matchPrincipals(principal, principalType, context) &&
                    this.matchNotPrincipals(principal, principalType, context));
            return false;
        }
        if (this.hasPrincipals)
            return false;
        return true;
    }
    /*valueComing resource noResource
    true        false     false       false
    true        true      false       true or false
    true        false     true        true or false
    false       false     false       true
    false       true      false       false
    false       false     true        false*/
    matchResourceAndNotResource(resource, context) {
        if (resource) {
            if (this.hasResources)
                return (this.matchResources(resource, context) &&
                    this.matchNotResources(resource, context));
            return false;
        }
        if (this.hasResources)
            return false;
        return true;
    }
    checkAndAssignActions(identity) {
        const hasAction = 'action' in identity;
        const hasNotAction = 'notAction' in identity;
        if (hasAction && hasNotAction) {
            throw new TypeError('ResourceBased statement should have an action or a notAction attribute, no both');
        }
        if ('action' in identity) {
            this.action =
                typeof identity.action === 'string'
                    ? [identity.action]
                    : identity.action;
        }
        else {
            this.notAction =
                typeof identity.notAction === 'string'
                    ? [identity.notAction]
                    : identity.notAction;
        }
    }
    checkAndAssignPrincipals(identity) {
        const hasPrincipal = 'principal' in identity;
        const hasNotPrincipal = 'notPrincipal' in identity;
        if (hasPrincipal && hasNotPrincipal) {
            throw new TypeError('ResourceBased statement could have a principal or a notPrincipal attribute, no both');
        }
        if ('principal' in identity) {
            this.principal =
                typeof identity.principal === 'string'
                    ? [identity.principal]
                    : identity.principal;
            this.hasPrincipals = true;
        }
        else if ('notPrincipal' in identity) {
            this.notPrincipal =
                typeof identity.notPrincipal === 'string'
                    ? [identity.notPrincipal]
                    : identity.notPrincipal;
            this.hasPrincipals = true;
        }
    }
    checkAndAssignResources(identity) {
        const hasResource = 'resource' in identity;
        const hasNotResource = 'notResource' in identity;
        if (hasResource && hasNotResource) {
            throw new TypeError('ResourceBased statement could have a resource or a notResource attribute, no both');
        }
        if ('resource' in identity) {
            this.resource =
                typeof identity.resource === 'string'
                    ? [identity.resource]
                    : identity.resource;
            this.hasResources = true;
        }
        else if ('notResource' in identity) {
            this.notResource =
                typeof identity.notResource === 'string'
                    ? [identity.notResource]
                    : identity.notResource;
            this.hasResources = true;
        }
    }
    matchPrincipals(principal, principalType, context) {
        if (this.principal) {
            if (this.principal instanceof Array) {
                return principalType
                    ? false
                    : this.principal.some((a) => new Matcher(applyContext(a, context)).match(principal));
            }
            else {
                if (principalType) {
                    const principalValues = this.principal[principalType];
                    if (principalValues instanceof Array) {
                        return principalValues.some((a) => new Matcher(applyContext(a, context)).match(principal));
                    }
                    else if (principalValues) {
                        return new Matcher(applyContext(principalValues, context)).match(principal);
                    }
                    return false;
                }
                return false;
            }
        }
        return true;
    }
    matchNotPrincipals(principal, principalType, context) {
        if (this.notPrincipal) {
            if (this.notPrincipal instanceof Array) {
                return principalType
                    ? true
                    : !this.notPrincipal.some((a) => new Matcher(applyContext(a, context)).match(principal));
            }
            else {
                if (principalType) {
                    const principalValues = this.notPrincipal[principalType];
                    if (principalValues instanceof Array) {
                        return !principalValues.some((a) => new Matcher(applyContext(a, context)).match(principal));
                    }
                    else if (principalValues) {
                        return !new Matcher(applyContext(principalValues, context)).match(principal);
                    }
                    return true;
                }
                return true;
            }
        }
        return true;
    }
    matchActions(action, context) {
        return this.action
            ? this.action.some((a) => new Matcher(applyContext(a, context)).match(action))
            : true;
    }
    matchNotActions(action, context) {
        return this.notAction
            ? !this.notAction.some((a) => new Matcher(applyContext(a, context)).match(action))
            : true;
    }
    matchResources(resource, context) {
        return this.resource
            ? this.resource.some((a) => new Matcher(applyContext(a, context)).match(resource))
            : true;
    }
    matchNotResources(resource, context) {
        return this.notResource
            ? !this.notResource.some((a) => new Matcher(applyContext(a, context)).match(resource))
            : true;
    }
}

class Policy {
    constructor({ context, conditionResolver }) {
        this.context = context;
        this.conditionResolver = conditionResolver;
    }
    setContext(context) {
        this.context = context;
    }
    getContext() {
        return this.context;
    }
    setConditionResolver(conditionResolver) {
        this.conditionResolver = conditionResolver;
    }
    getConditionResolver() {
        return this.conditionResolver;
    }
}

class ActionBasedPolicy extends Policy {
    constructor({ statements, conditionResolver, context }) {
        super({ context, conditionResolver });
        const statementInstances = statements.map((statement) => new ActionBased(statement));
        this.allowStatements = statementInstances.filter((s) => s.effect === 'allow');
        this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
        this.statements = statementInstances.map((statement) => statement.getStatement());
    }
    addStatement(statement) {
        const statementInstance = new ActionBased(statement);
        if (statementInstance.effect === 'allow') {
            this.allowStatements.push(statementInstance);
        }
        else {
            this.denyStatements.push(statementInstance);
        }
        this.statements.push(statementInstance.getStatement());
    }
    getStatements() {
        return this.statements;
    }
    evaluate({ action, context }) {
        const args = { action, context };
        return !this.cannot(args) && this.can(args);
    }
    can({ action, context }) {
        return this.allowStatements.some((s) => s.matches({
            action,
            context: context || this.context,
            conditionResolver: this.conditionResolver
        }));
    }
    whyCan({ action, context }) {
        return this.allowStatements.reduce((statements, currentStatement) => {
            const matches = currentStatement.matches({
                action,
                context: context || this.context,
                conditionResolver: this.conditionResolver
            });
            if (matches) {
                return [...statements, currentStatement.getStatement()];
            }
            return statements;
        }, []);
    }
    cannot({ action, context }) {
        return this.denyStatements.some((s) => s.matches({
            action,
            context: context || this.context,
            conditionResolver: this.conditionResolver
        }));
    }
    whyCannot({ action, context }) {
        return this.denyStatements.reduce((statements, currentStatement) => {
            const matches = currentStatement.matches({
                action,
                context: context || this.context,
                conditionResolver: this.conditionResolver
            });
            if (matches) {
                return [...statements, currentStatement.getStatement()];
            }
            return statements;
        }, []);
    }
    generateProxy(obj, options = {}) {
        const { get = {}, set = {} } = options;
        const { allow: allowGet = true, propertyMap: propertyMapGet = {} } = get;
        const { allow: allowSet = true, propertyMap: propertyMapSet = {} } = set;
        const handler = Object.assign(Object.assign({}, (allowGet
            ? {
                get: (target, prop) => {
                    const property = Reflect.has(propertyMapGet, prop)
                        ? Reflect.get(propertyMapGet, prop)
                        : prop;
                    if (typeof prop === 'string') {
                        if (this.evaluate({ action: property })) {
                            return Reflect.get(target, prop);
                        }
                        else {
                            throw new Error(`Unauthorize to get ${prop} property`);
                        }
                    }
                    else {
                        return Reflect.get(target, prop);
                    }
                }
            }
            : {})), (allowSet
            ? {
                set: (target, prop, value) => {
                    const property = Reflect.has(propertyMapSet, prop)
                        ? Reflect.get(propertyMapSet, prop)
                        : prop;
                    if (typeof prop === 'string') {
                        if (this.evaluate({ action: property })) {
                            return Reflect.set(target, prop, value);
                        }
                        else {
                            throw new Error(`Unauthorize to set ${prop} property`);
                        }
                    }
                    else {
                        return false;
                    }
                }
            }
            : {}));
        return new Proxy(obj, handler);
    }
}

class IdentityBasedPolicy extends Policy {
    constructor({ statements, conditionResolver, context }) {
        super({ context, conditionResolver });
        const statementInstances = statements.map((statement) => new IdentityBased(statement));
        this.allowStatements = statementInstances.filter((s) => s.effect === 'allow');
        this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
        this.statements = statementInstances.map((statement) => statement.getStatement());
    }
    addStatement(statement) {
        const statementInstance = new IdentityBased(statement);
        if (statementInstance.effect === 'allow') {
            this.allowStatements.push(statementInstance);
        }
        else {
            this.denyStatements.push(statementInstance);
        }
        this.statements.push(statementInstance.getStatement());
    }
    getStatements() {
        return this.statements;
    }
    evaluate({ action, resource, context }) {
        const args = { action, resource, context };
        return !this.cannot(args) && this.can(args);
    }
    can({ action, resource, context }) {
        return this.allowStatements.some((s) => s.matches({
            action,
            resource,
            context: context || this.context,
            conditionResolver: this.conditionResolver
        }));
    }
    whyCan({ action, resource, context }) {
        return this.allowStatements.reduce((statements, currentStatement) => {
            const matches = currentStatement.matches({
                action,
                resource,
                context: context || this.context,
                conditionResolver: this.conditionResolver
            });
            if (matches) {
                return [...statements, currentStatement.getStatement()];
            }
            return statements;
        }, []);
    }
    cannot({ action, resource, context }) {
        return this.denyStatements.some((s) => s.matches({
            action,
            resource,
            context: context || this.context,
            conditionResolver: this.conditionResolver
        }));
    }
    whyCannot({ action, resource, context }) {
        return this.denyStatements.reduce((statements, currentStatement) => {
            const matches = currentStatement.matches({
                action,
                resource,
                context: context || this.context,
                conditionResolver: this.conditionResolver
            });
            if (matches) {
                return [...statements, currentStatement.getStatement()];
            }
            return statements;
        }, []);
    }
}

class ResourceBasedPolicy extends Policy {
    constructor({ statements, conditionResolver, context }) {
        super({ context, conditionResolver });
        const statementInstances = statements.map((statement) => new ResourceBased(statement));
        this.allowStatements = statementInstances.filter((s) => s.effect === 'allow');
        this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
        this.statements = statementInstances.map((statement) => statement.getStatement());
    }
    addStatement(statement) {
        const statementInstance = new ResourceBased(statement);
        if (statementInstance.effect === 'allow') {
            this.allowStatements.push(statementInstance);
        }
        else {
            this.denyStatements.push(statementInstance);
        }
        this.statements.push(statementInstance.getStatement());
    }
    getStatements() {
        return this.statements;
    }
    evaluate({ principal, action, resource, principalType, context }) {
        const args = { principal, action, resource, principalType, context };
        return !this.cannot(args) && this.can(args);
    }
    can({ principal, action, resource, principalType, context }) {
        return this.allowStatements.some((s) => s.matches({
            principal,
            action,
            resource,
            principalType,
            context: context || this.context,
            conditionResolver: this.conditionResolver
        }));
    }
    cannot({ principal, action, resource, principalType, context }) {
        return this.denyStatements.some((s) => s.matches({
            principal,
            action,
            resource,
            principalType,
            context: context || this.context,
            conditionResolver: this.conditionResolver
        }));
    }
}

exports.ActionBased = ActionBased;
exports.ActionBasedPolicy = ActionBasedPolicy;
exports.IdentityBased = IdentityBased;
exports.IdentityBasedPolicy = IdentityBasedPolicy;
exports.ResourceBased = ResourceBased;
exports.ResourceBasedPolicy = ResourceBasedPolicy;
exports.applyContext = applyContext;
exports.getValueFromPath = getValueFromPath;
//# sourceMappingURL=main.js.map

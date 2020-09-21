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
 *
 * isSymbol(Symbol())
 * // => true
 *
 * isSymbol('abc')
 * // => false
 */
function isSymbol(value) {
  const type = typeof value;
  return (
    type === 'symbol' ||
    (type === 'object' && value !== null && getTag(value) === '[object Symbol]')
  );
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
  const result = `${value}`;
  return result === '0' && 1 / value === -INFINITY ? '-0' : result;
}

/** Used to match property names within property paths. */
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/; //matches any word caracter (alphanumeric and underscore)
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
  if (Array.isArray(value)) {
    return false;
  }
  const type = typeof value;
  if (
    type === 'number' ||
    type === 'boolean' ||
    value === null ||
    isSymbol(value)
  ) {
    return true;
  }
  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object !== null && value in Object(object))
  );
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
  const memoized = function(...args) {
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
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
  const result = memoize(func, key => {
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
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g'
);
/**
 * Converts `string` to a property path array.
 *
 * @since 3.1.0
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
const stringToPath = memoizeCapped(string => {
  const result = [];
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, '$1');
    } else if (expression) {
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
const specialTrim = str => str.replace(trim, '');
function applyContext(str, context) {
  if (!context) return str;
  return specialTrim(
    str.replace(reDelimiters, (_, path) => {
      const value = getValueFromPath(context, path);
      if (Array.isArray(value)) return `{${value}}`;
      if (value instanceof Object) return String(undefined);
      return String(value);
    })
  );
}
class Statement {
  constructor({ effect = 'allow', condition }) {
    this.effect = effect;
    this.condition = condition;
  }
  matchConditions({ context, conditionResolver }) {
    return conditionResolver && this.condition && context
      ? Object.keys(this.condition).every(condition =>
          Object.keys(this.condition ? this.condition[condition] : {}).every(
            path => {
              if (this.condition) {
                const conditionValues = this.condition[condition][path];
                if (conditionValues instanceof Array) {
                  return conditionValues.some(value =>
                    conditionResolver[condition](
                      getValueFromPath(context, path),
                      value
                    )
                  );
                }
                return conditionResolver[condition](
                  getValueFromPath(context, path),
                  conditionValues
                );
              }
              return conditionResolver[condition](
                getValueFromPath(context, path),
                ''
              );
            }
          )
        )
      : true;
  }
}

/**
 * Validate if an `object` is an instance of `ActionBlock`.
 * @param {Object} object Object to validate
 * @returns {boolean} Returns true if `object` has `action` attribute.
 * @example
 * ```javascript
 * instanceOfActionBlock({ action: 'something' })
 * // => true
 * ```
 */
function instanceOfActionBlock(object) {
  return 'action' in object;
}
/**
 * Validate if an `object` is an instance of `PrincipalBlock`.
 * @param {Object} object Object to validate
 * @returns {boolean} Returns true if `object` has `principal` attribute.
 * @example
 * ```javascript
 * instanceOfPrincipalBlock({ principal: 'something' })
 * // => true
 * ```
 */
function instanceOfPrincipalBlock(object) {
  return 'principal' in object;
}
/**
 * Validate if an `object` is an instance of `NotResourceBlock`.
 * @param {Object} object Object to validate
 * @returns {boolean} Returns true if `object` has `notResource` attribute.
 * @example
 * ```javascript
 * instanceOfNotResourceBlock({ notResource: 'something' })
 * // => true
 * ```
 */
function instanceOfNotResourceBlock(object) {
  return 'notResource' in object;
}
/**
 * Validate if an `object` is an instance of `ResourceBlock`.
 * @param {Object} object Object to validate
 * @returns {boolean} Returns true if `object` has `resource` attribute.
 * @example
 * ```javascript
 * instanceOfResourceBlock({ resource: 'something' })
 * // => true
 * ```
 */
function instanceOfResourceBlock(object) {
  return 'resource' in object;
}
//export { IdentityBasedType, ResourceBasedType, PrincipalMap, Patterns, ResourceBlock, ActionBlock};
/*
type Message = MessageWithText | MessageWithAttachment | (MessageWithText & MessageWithAttachment);*/
/*<condition_block> = "Condition" : { <condition_map> }
<condition_map> = {
  <condition_type_string> : { <condition_key_string> : <condition_value_list> },
  <condition_type_string> : { <condition_key_string> : <condition_value_list> }, ...
}
<condition_value_list> = [<condition_value>, <condition_value>, ...]
<condition_value> = ("string" | "number" | "Boolean")

//ConditionBlock
condition: {//ConditionMap
        ConditionTypeString        greaterThan: {
        ConditionKeyString          'user.age': 18 //ConditionValueList,
                },
              }

*/

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
  const [beginningIndex, finalIndex] = getIndexRange(
    initialSeparator,
    finalSeparator,
    str
  );
  return {
    start: beginningIndex,
    end: finalIndex,
    pre: beginningIndex >= 0 ? str.slice(0, beginningIndex) : '',
    body:
      beginningIndex >= 0
        ? str.slice(beginningIndex + initialSeparator.length, finalIndex)
        : '',
    post:
      beginningIndex >= 0 ? str.slice(finalIndex + finalSeparator.length) : ''
  };
}

class Matcher {
  constructor(pattern) {
    this.set = [];
    this.pattern = pattern.trim();
    this.empty = !this.pattern ? true : false;
    const set = this.braceExpand();
    this.set = set.map(val => this.parse(val));
    this.set = this.set.filter(s => {
      return Boolean(s);
    });
  }
  braceExpand() {
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
  parse(pattern) {
    if (pattern.length > 1024 * 64) {
      throw new TypeError('pattern is too long');
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
  expand(str, isTop) {
    const expansions = [];
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
  match(str) {
    if (this.empty) return str === '';
    const set = this.set;
    return set.some(pattern => this.matchOne(str, pattern));
  }
  matchOne(str, pattern) {
    if (!pattern) return false;
    if (typeof pattern === 'string') {
      return str === pattern;
    }
    return Boolean(str.match(pattern));
  }
}

class ActionBased extends Statement {
  constructor(action) {
    super(action);
    if (instanceOfActionBlock(action)) {
      this.action =
        typeof action.action === 'string' ? [action.action] : action.action;
    } else {
      this.notAction =
        typeof action.notAction === 'string'
          ? [action.notAction]
          : action.notAction;
    }
    this.statement = action;
  }
  getStatement() {
    return this.statement;
  }
  matches({ action, context, conditionResolver }) {
    return (
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }
  matchActions(action, context) {
    return this.action
      ? this.action.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }
  matchNotActions(action, context) {
    return this.notAction
      ? !this.notAction.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }
}

class IdentityBased extends Statement {
  constructor(identity) {
    super(identity);
    if (instanceOfResourceBlock(identity)) {
      this.resource =
        typeof identity.resource === 'string'
          ? [identity.resource]
          : identity.resource;
    } else {
      this.notResource =
        typeof identity.notResource === 'string'
          ? [identity.notResource]
          : identity.notResource;
    }
    if (instanceOfActionBlock(identity)) {
      this.action =
        typeof identity.action === 'string'
          ? [identity.action]
          : identity.action;
    } else {
      this.notAction =
        typeof identity.notAction === 'string'
          ? [identity.notAction]
          : identity.notAction;
    }
    this.statement = identity;
  }
  getStatement() {
    return this.statement;
  }
  matches({ action, resource, context, conditionResolver }) {
    return (
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchResources(resource, context) &&
      this.matchNotResources(resource, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }
  matchActions(action, context) {
    return this.action
      ? this.action.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }
  matchNotActions(action, context) {
    return this.notAction
      ? !this.notAction.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }
  matchResources(resource, context) {
    return this.resource
      ? this.resource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
  matchNotResources(resource, context) {
    return this.notResource
      ? !this.notResource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
}

class ResourceBased extends Statement {
  constructor(identity) {
    super(identity);
    if (instanceOfResourceBlock(identity)) {
      this.resource =
        typeof identity.resource === 'string'
          ? [identity.resource]
          : identity.resource;
    } else if (instanceOfNotResourceBlock(identity)) {
      this.notResource =
        typeof identity.notResource === 'string'
          ? [identity.notResource]
          : identity.notResource;
    }
    if (instanceOfActionBlock(identity)) {
      this.action =
        typeof identity.action === 'string'
          ? [identity.action]
          : identity.action;
    } else {
      this.notAction =
        typeof identity.notAction === 'string'
          ? [identity.notAction]
          : identity.notAction;
    }
    if (instanceOfPrincipalBlock(identity)) {
      this.principal =
        typeof identity.principal === 'string'
          ? [identity.principal]
          : identity.principal;
    } else {
      this.notPrincipal =
        typeof identity.notPrincipal === 'string'
          ? [identity.notPrincipal]
          : identity.notPrincipal;
    }
    this.statement = identity;
  }
  getStatement() {
    return this.statement;
  }
  matches({
    principal,
    action,
    resource,
    principalType,
    context,
    conditionResolver
  }) {
    return (
      this.matchPrincipals(principal, principalType, context) &&
      this.matchNotPrincipals(principal, principalType, context) &&
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchResources(resource, context) &&
      this.matchNotResources(resource, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }
  matchPrincipals(principal, principalType, context) {
    if (this.principal) {
      if (this.principal instanceof Array) {
        return principalType
          ? false
          : this.principal.some(a =>
              new Matcher(applyContext(a, context)).match(principal)
            );
      } else {
        if (principalType) {
          const principalValues = this.principal[principalType];
          if (principalValues instanceof Array) {
            return typeof principalValues === 'string'
              ? [principalValues].some(a =>
                  new Matcher(applyContext(a, context)).match(principal)
                )
              : principalValues.some(a =>
                  new Matcher(applyContext(a, context)).match(principal)
                );
          }
          return new Matcher(applyContext(principalValues, context)).match(
            principal
          );
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
          : !this.notPrincipal.some(a =>
              new Matcher(applyContext(a, context)).match(principal)
            );
      } else {
        if (principalType) {
          const principalValues = this.notPrincipal[principalType];
          if (principalValues instanceof Array) {
            return typeof principalValues === 'string'
              ? ![principalValues].some(a =>
                  new Matcher(applyContext(a, context)).match(principal)
                )
              : !principalValues.some(a =>
                  new Matcher(applyContext(a, context)).match(principal)
                );
          }
          return !new Matcher(applyContext(principalValues, context)).match(
            principal
          );
        }
        return false;
      }
    }
    return true;
  }
  matchActions(action, context) {
    return this.action
      ? this.action.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }
  matchNotActions(action, context) {
    return this.notAction
      ? !this.notAction.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }
  matchResources(resource, context) {
    return this.resource
      ? this.resource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
  matchNotResources(resource, context) {
    return this.notResource
      ? !this.notResource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
}

class ActionBasedPolicy {
  constructor(config, conditionResolver) {
    const statementInstances = config.map(s => new ActionBased(s));
    this.allowStatements = statementInstances.filter(s => s.effect === 'allow');
    this.denyStatements = statementInstances.filter(s => s.effect === 'deny');
    this.conditionResolver = conditionResolver;
    this.statements = config;
  }
  getStatements() {
    return this.statements;
  }
  evaluate({ action, context }) {
    const args = { action, context };
    return !this.cannot(args) && this.can(args);
  }
  can({ action, context }) {
    return this.allowStatements.some(s =>
      s.matches({
        action,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
  cannot({ action, context }) {
    return this.denyStatements.some(s =>
      s.matches({
        action,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

class IdentityBasedPolicy {
  constructor(config, conditionResolver) {
    const statementInstances = config.map(s => new IdentityBased(s));
    this.allowStatements = statementInstances.filter(s => s.effect === 'allow');
    this.denyStatements = statementInstances.filter(s => s.effect === 'deny');
    this.conditionResolver = conditionResolver;
    this.statements = config;
  }
  getStatements() {
    return this.statements;
  }
  evaluate({ action, resource, context }) {
    const args = { action, resource, context };
    return !this.cannot(args) && this.can(args);
  }
  can({ action, resource, context }) {
    return this.allowStatements.some(s =>
      s.matches({
        action,
        resource,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
  cannot({ action, resource, context }) {
    return this.denyStatements.some(s =>
      s.matches({
        action,
        resource,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

class ResourceBasedPolicy {
  constructor(config, conditionResolver) {
    const statementInstances = config.map(s => new ResourceBased(s));
    this.allowStatements = statementInstances.filter(s => s.effect === 'allow');
    this.denyStatements = statementInstances.filter(s => s.effect === 'deny');
    this.conditionResolver = conditionResolver;
    this.statements = config;
  }
  getStatements() {
    return this.statements;
  }
  evaluate({ principal, action, resource, principalType, context }) {
    const args = { principal, action, resource, principalType, context };
    return !this.cannot(args) && this.can(args);
  }
  can({ principal, action, resource, principalType, context }) {
    return this.allowStatements.some(s =>
      s.matches({
        principal,
        action,
        resource,
        principalType,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
  cannot({ principal, action, resource, principalType, context }) {
    return this.denyStatements.some(s =>
      s.matches({
        principal,
        action,
        resource,
        principalType,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

exports.ActionBased = ActionBased;
exports.ActionBasedPolicy = ActionBasedPolicy;
exports.IdentityBased = IdentityBased;
exports.IdentityBasedPolicy = IdentityBasedPolicy;
exports.ResourceBased = ResourceBased;
exports.ResourceBasedPolicy = ResourceBasedPolicy;
exports.Statement = Statement;
exports.applyContext = applyContext;
exports.baseGet = baseGet;
exports.castPath = castPath;
exports.getValueFromPath = getValueFromPath;
//# sourceMappingURL=main.js.map

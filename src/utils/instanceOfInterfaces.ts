import {
  ActionBlock,
  NotActionBlock,
  PrincipalBlock,
  NotResourceBlock,
  ResourceBlock
} from '../types';

/**
 * Validate if an `object` is an instance of `ActionBlock`.
 * @param {Object} object Object to validate
 * @returns {boolean} Returns true if `object` has `action` attribute.
 * @example
 * ```javascript
 * instanceOfActionBlock({ action: 'something' })
 * // => true
 *
 * instanceOfActionBlock({ notAction: 'something' })
 * // => false
 * ```
 */
export function instanceOfActionBlock(object: object): object is ActionBlock {
  return 'action' in object;
}

/**
 * Validate if an `object` is an instance of `NotActionBlock`.
 * @param {Object} object Object to validate
 * @returns {boolean} Returns true if `object` has `notAction` attribute.
 * @example
 * ```javascript
 * instanceOfNotActionBlock({ notAction: 'something' })
 * // => true
 *
 * instanceOfNotActionBlock({ action: 'something' })
 * // => false
 * ```
 */
export function instanceOfNotActionBlock(
  object: object
): object is NotActionBlock {
  return 'notAction' in object;
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
export function instanceOfPrincipalBlock(
  object: object
): object is PrincipalBlock {
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
 *
 * instanceOfNotResourceBlock({ resource: 'something' })
 * // => false
 * ```
 */
export function instanceOfNotResourceBlock(
  object: object
): object is NotResourceBlock {
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
 *
 * instanceOfResourceBlock({ notResource: 'something' })
 * // => false
 * ```
 */
export function instanceOfResourceBlock(
  object: object
): object is ResourceBlock {
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

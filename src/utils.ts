import {
  ResourceBlock,
  ActionBlock,
  NotResourceBlock,
  PrincipalBlock,
} from './types';
export function instanceOfResourceBlock(object: any): object is ResourceBlock {
  return 'resource' in object;
}

export function instanceOfActionBlock(object: any): object is ActionBlock {
  return 'action' in object;
}

export function instanceOfNotResourceBlock(
  object: any
): object is NotResourceBlock {
  return 'notResource' in object;
}

export function instanceOfPrincipalBlock(
  object: any
): object is PrincipalBlock {
  return 'principal' in object;
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
        ConditionTypeString        greatherThan: {
        ConditionKeyString          'user.age': 18 //ConditionValueList,
                },
              }

*/

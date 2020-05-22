export type EffectBlock = 'allow' | 'deny';
type Patterns = string[] | string;

interface PrincipalMap {
  [key: string]: Patterns;
}

interface PrincipalBlock {
  principal: PrincipalMap | Patterns;
}

interface NotPrincipalBlock {
  notPrincipal: PrincipalMap | Patterns;
}

interface ActionBlock {
  action: Patterns;
}

interface NotActionBlock {
  notAction: Patterns;
}

interface ResourceBlock {
  resource: Patterns;
}

interface NotResourceBlock {
  notResource: Patterns;
}

export type ConditionKey = string | number | boolean;

export interface ConditionMap {
  [key: string]: ConditionKey[] | ConditionKey;
}

export interface ConditionBlock {
  [key: string]: ConditionMap;
}

export interface StatementInterface {
  sid?: string;
  effect?: EffectBlock;
  condition?: ConditionBlock;
}

export interface DecomposeString {
  start: number;
  end: number;
  pre: string;
  body: string;
  post: string;
}

type Resolver = (data: any, expected: any) => boolean;

export interface ConditionResolver {
  [key: string]: Resolver;
}

export interface Context {
  [key: string]: ConditionKey | Context | string[] | number[];
}

export interface MatchConditionInterface {
  context?: Context;
  conditionResolver?: ConditionResolver;
}

export interface MatchIdentityBasedInterface extends MatchConditionInterface {
  action: string;
  resource: string;
}

export interface MatchResourceBasedInterface
  extends MatchIdentityBasedInterface {
  principal: string;
  principalType?: string;
}

export interface EvaluateIdentityBasedInterface {
  action: string;
  resource: string;
  context?: Context;
}

export interface EvaluateResourceBasedInterface
  extends EvaluateIdentityBasedInterface {
  principal: string;
  principalType?: string;
  action: string;
  resource: string;
  context?: Context;
}

export interface MemoizeInterface extends Function {
  cache: Map<any, any>;
}

type IdentityBasedType = StatementInterface &
  (ActionBlock | NotActionBlock) &
  (ResourceBlock | NotResourceBlock);

type ResourceBasedType = StatementInterface &
  (PrincipalBlock | NotPrincipalBlock) &
  (ActionBlock | NotActionBlock) &
  (ResourceBlock | NotResourceBlock | {});

export {
  IdentityBasedType,
  ResourceBasedType,
  PrincipalMap,
  Patterns,
  ResourceBlock,
  NotResourceBlock,
  ActionBlock,
  PrincipalBlock
};

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

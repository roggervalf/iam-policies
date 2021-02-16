export type EffectBlock = 'allow' | 'deny';
type Patterns = string[] | string;

interface PrincipalMap {
  [key: string]: Patterns;
}

interface OptionalPrincipalBlock {
  principal?: PrincipalMap | Patterns;
}

interface OptionalNotPrincipalBlock {
  notPrincipal?: PrincipalMap | Patterns;
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

interface OptionalResourceBlock {
  resource?: Patterns;
}

interface OptionalNotResourceBlock {
  notResource?: Patterns;
}

export type ConditionKey = string | number | boolean;

export interface ConditionMap {
  [key: string]: ConditionKey[] | ConditionKey;
}

export type ConditionBlock = Record<string, Record<string, unknown>>;

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

export interface MatchConditionInterface<T extends object> {
  context?: T;
  conditionResolver?: ConditionResolver;
}

export interface MatchConditionResolverInterface<T extends object> {
  context: T
  conditionResolver?: ConditionResolver;
  path: string;
  condition: string;
  value: any;
}

export interface MatchActionBasedInterface<T extends object>
  extends MatchConditionInterface<T> {
  action: string;
}

export interface MatchIdentityBasedInterface<T extends object>
  extends MatchActionBasedInterface<T> {
  resource: string;
}

export interface MatchResourceBasedInterface<T extends object>
  extends MatchActionBasedInterface<T> {
  principal?: string;
  principalType?: string;
  resource?: string;
}

export interface EvaluateActionBasedInterface<T extends object> {
  action: string;
  context?: T;
}

export interface EvaluateIdentityBasedInterface<T extends object>
  extends EvaluateActionBasedInterface<T> {
  resource: string;
}

export interface EvaluateResourceBasedInterface<T extends object>
  extends EvaluateActionBasedInterface<T> {
  principal?: string;
  principalType?: string;
  resource?: string;
}

export interface MemoizeInterface extends Function {
  cache: Map<any, any>;
}

type ActionBasedType = StatementInterface & (ActionBlock | NotActionBlock);

type IdentityBasedType = StatementInterface &
  (ActionBlock | NotActionBlock) &
  (ResourceBlock | NotResourceBlock);

type ResourceBasedType = StatementInterface &
  (OptionalPrincipalBlock | OptionalNotPrincipalBlock) &
  (ActionBlock | NotActionBlock) &
  (OptionalResourceBlock | OptionalNotResourceBlock);

interface ProxyOptions {
  get?: {
    allow?: boolean;
    propertyMap?: Record<string, string>;
  };
  set?: {
    allow?: boolean;
    propertyMap?: Record<string, string>;
  };
}

export {
  ActionBasedType,
  IdentityBasedType,
  Patterns,
  PrincipalMap,
  ResourceBasedType,
  ProxyOptions
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

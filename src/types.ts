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

export type ConditionKey = string | number | boolean

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
};

export interface Balance {
  start: number;
  end: number;
  pre: string;
  body: string;
  post: string;
}

type Resolver = (data: ConditionKey, expected: ConditionKey) => boolean;

export interface ConditionResolver {
  [key: string]: Resolver;
}

export interface Context {
  [key: string]: ConditionKey | Context | string[] | number[];
}

export interface MatchConditionInterface {
  context?: Context,
  conditionResolver?: ConditionResolver
}

export interface MatchIdentityBasedInterface extends MatchConditionInterface {
  action: string,
  resource: string
}

export interface MatchResourceBasedInterface extends MatchIdentityBasedInterface {
  principal: string,
  principalType?: string
}

export interface CanIdentityBasedInterface {
  action: string,
  resource: string,
  context?: Context
}

export interface CanResourceBasedInterface extends CanIdentityBasedInterface{
  principal: string,
  principalType?: string,
  action: string,
  resource: string,
  context?: Context
}

type IdentityBasedType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock)

type ResourceBasedType = StatementInterface & (PrincipalBlock | NotPrincipalBlock) & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock | {})

//type PermissionsBoundariesType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock)
//type OrganizationsSCPsType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock)

export { IdentityBasedType, ResourceBasedType, PrincipalMap, Patterns, ResourceBlock, NotResourceBlock, ActionBlock, PrincipalBlock};

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

const IdentityBasedExample1: IdentityBasedType = {
  "effect": "allow",
  "action": "s3:ListBucket",
  "resource": "arn:aws:s3:::example_bucket"
}

const IdentityBasedExample2: IdentityBasedType = {
  "effect": "allow",
  "notAction": "s3:ListBucket",
  "resource": "arn:aws:s3:::example_bucket"
}

const IdentityBasedExample3: IdentityBasedType = {
  "effect": "allow",
  "notAction": "s3:ListBucket",
  "notResource": "arn:aws:s3:::example_bucket"
}

const ResourceBasedExample1: ResourceBasedType = {
  "sid": "1",
  "effect": "allow",
  "principal": {"AWS": ["arn:aws:iam::ACCOUNT-ID-WITHOUT-HYPHENS:root"]},
  "action": "s3:*",
  "resource": [
    "arn:aws:s3:::mybucket",
    "arn:aws:s3:::mybucket/*"
  ]
}

const ResourceBasedExample2: ResourceBasedType = {
  "sid": "1",
  "effect": "allow",
  "principal": {"AWS": ["arn:aws:iam::ACCOUNT-ID-WITHOUT-HYPHENS:root"]},
  "action": "s3:*"
}

/*const PermissionBoundaryExample1: PermissionsBoundariesType = {
  "effect": "allow",
  "action": [
      "s3:*",
      "cloudwatch:*",
      "ec2:*"
  ],
  "resource": "*"
}

const PermissionBoundaryExample2: PermissionsBoundariesType = {
  "effect": "allow",
  "action": [
      "s3:*",
      "cloudwatch:*",
      "ec2:*"
  ],
  "resource": "*",
  "condition": {
    "NumericLessThanEquals": {"aws:MultiFactorAuthAge": "3600"}
  }
}
*/
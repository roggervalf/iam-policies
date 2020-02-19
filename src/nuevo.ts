type EffectBlock = 'allow' | 'deny';
type Patterns = string[] | string;

interface PrincipalMap {
  [key: string]: Patterns;
}

interface PrincipalBlock {
  principal?: PrincipalMap | Patterns;
}

interface NotPrincipalBlock {
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

type ConditionKey = string | number | boolean

interface ConditionMap {
  [key: string]: ConditionKey[] | ConditionKey;
}

interface ConditionBlock {
  [key: string]: ConditionMap;
}

interface StatementInterface {
  sid?: string;
  effect?: EffectBlock;
  condition?: ConditionBlock;
};

type IdentityBasedType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock)

type ResourceBasedType = StatementInterface & (PrincipalBlock | NotPrincipalBlock) & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock | {})

type PermissionsBoundariesType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock)
type OrganizationsSCPsType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock)

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

const PermissionBoundaryExample1: PermissionsBoundariesType = {
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

const reDelimiters = /\${([^}])*}/g;
const trim = / +(?= )|^\s+|\s+$/g;

interface Balance {
  start: number;
  end: number;
  pre: string;
  body: string;
  post: string;
}

type Resolver = (data: ConditionKey, expected: ConditionKey) => boolean;

interface ConditionResolver {
  [key: string]: Resolver;
}

interface Context {
  [key: string]: ConditionKey | Context | string[] | number[];
}

export function getValueFromPath(data: any, path: string): any {
  const value = path.split('.').reduce((key, nextChild) => {
    return data[key] ? data[key][nextChild] : undefined;
  });

  if (Array.isArray(value)) return `{${value}}`;

  return value;
}

const specialTrim = (str: string): string => str.replace(trim, '');

export function applyContext(str: string, context?: object): string {
  if (!context) return str;

  return specialTrim(
    str.replace(reDelimiters, match => {
      const path = match.substr(2, match.length - 3);

      return match ? String(getValueFromPath(context, path)) : '';
    })
  );
}

function range(a: string, b: string, str: string): number[] {
  const left = str.indexOf(a);
  const right = str.indexOf(b, left + 1);

  if (left >= 0 && right > 0) {
    return [left, right];
  }

  return [-1, -1];
}

function balanced(a: string, b: string, str: string): Balance {
  const r = range(a, b, str);

  return {
    start: r[0],
    end: r[1],
    pre: r[0] >= 0 ? str.slice(0, r[0]) : '',
    body: r[0] >= 0 ? str.slice(r[0] + a.length, r[1]) : '',
    post: r[0] >= 0 ? str.slice(r[1] + b.length) : '',
  };
}

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

  braceExpand(): string[] {
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

  parse(pattern: string): string | RegExp {
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
        re += '[^/]*?';
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

  expand(str: string, isTop?: boolean): string[] {
    const expansions = [] as string[];
    const balance = balanced('{', '}', str);
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

  matchOne(str: string, pattern: string | RegExp): boolean {
    if (!pattern) return false;

    if (typeof pattern === 'string') {
      return str === pattern;
    }

    return Boolean(str.match(pattern));
  }
}

export class Statement {
  effect: EffectBlock;
  protected readonly condition?: ConditionBlock;

  constructor({
    effect = 'allow',
    condition,
  }: StatementInterface) {
    this.effect = effect;
    this.condition = condition;
  }

  matchConditions(
    context?: Context,
    conditionResolvers?: ConditionResolver
  ): boolean {
    return (
      (conditionResolvers && this.condition && context
        ? Object.keys(this.condition).every(condition =>
            Object.keys(
              this.condition ? this.condition[condition] : {}
            ).every(path =>{
              if(this.condition){
                const conditionValues=this.condition[condition][path]
                if(conditionValues instanceof Array){
                  return conditionValues.some(value=>conditionResolvers[condition](
                    getValueFromPath(context, path),
                    value
                  ))
                }
                return conditionResolvers[condition](
                  getValueFromPath(context, path),
                  conditionValues
                )
              }
              return conditionResolvers[condition](
                getValueFromPath(context, path),
                ''
              )
            }
              
            )
          )
        : true)
    );
  }
}

//type IdentityBased = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock)

function instanceOfResourceBlock(object: any): object is ResourceBlock {
  return 'resource' in object;
}

function instanceOfActionBlock(object: any): object is ActionBlock {
  return 'action' in object;
}

export class IdentityBased extends Statement{
  private resource?: string[];
  private action?: string[];
  private notResource?: string[];
  private notAction?: string[];
  
  constructor(identity: IdentityBasedType) {
    super(identity);
    if(instanceOfResourceBlock(identity)){
      this.resource = typeof identity.resource === 'string' ? [identity.resource] : identity.resource;  
    }else{
      this.notResource = typeof identity.notResource  === 'string' ? [identity.notResource] : identity.notResource;
    }
    if(instanceOfActionBlock(identity)){
      this.action = typeof identity.action === 'string' ? [identity.action] : identity.action;
    }else{
      this.notAction = typeof identity.notAction === 'string' ? [identity.notAction] : identity.notAction;
    }
  }

  matches(
    action: string,
    resource: string,
    context?: Context,
    conditionResolvers?: ConditionResolver
  ): boolean {
    return (
      this.matchActions(action,context) &&
      this.matchNotActions(action,context) &&
      this.matchResources(resource,context) &&
      this.matchNotResources(resource,context) &&
      this.matchConditions(context,conditionResolvers)
    );
  }

  matchActions( action: string, context?: object): boolean {
    return this.action?this.action.some(a =>
      new Matcher(applyContext(a, context)).match(action)):true }

  matchNotActions( action: string, context?: object): boolean {
    return this.notAction?!this.notAction.some(a =>
      new Matcher(applyContext(a, context)).match(action)):true }
  
 
  matchResources( resource: string, context?: object): boolean {
    return this.resource?this.resource.some(a =>
      new Matcher(applyContext(a, context)).match(resource)):true }
  
  matchNotResources( resource: string, context?: object): boolean {
    return this.notResource?!this.notResource.some(a =>
      new Matcher(applyContext(a, context)).match(resource)):true }
}

//type ResourceBasedType = StatementInterface & (PrincipalBlock | NotPrincipalBlock) & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock | {})

function instanceOfNotResourceBlock(object: any): object is NotResourceBlock {
  return 'notResource' in object;
}

function instanceOfPrincipalBlock(object: any): object is PrincipalBlock {
  return 'principal' in object;
}

/*function instanceOfPrincipalMap(object: any): object is PrincipalMap {
  return 'principal' in object;
}*/
/*function instanceOfActionBlock(object: any): object is ActionBlock {
  return 'action' in object;
}*/

export class ResourceBased extends Statement{
  private principal?: PrincipalMap | string[];
  private resource?: string[];
  private action?: string[];
  private notPrincipal?: PrincipalMap | string[];
  private notResource?: string[];
  private notAction?: string[];
  
  constructor(identity: ResourceBasedType) {
    super(identity);
    if(instanceOfResourceBlock(identity)){
      this.resource = typeof identity.resource === 'string' ? [identity.resource] : identity.resource;  
    }else if(instanceOfNotResourceBlock(identity)){
      this.notResource = typeof identity.notResource  === 'string' ? [identity.notResource] : identity.notResource;
    }
    if(instanceOfActionBlock(identity)){
      this.action = typeof identity.action === 'string' ? [identity.action] : identity.action;
    }else{
      this.notAction = typeof identity.notAction === 'string' ? [identity.notAction] : identity.notAction;
    }
    if(instanceOfPrincipalBlock(identity)){
      this.principal = typeof identity.principal === 'string' ? [identity.principal] : identity.principal;
    }else{
      this.notPrincipal = typeof identity.notPrincipal === 'string' ? [identity.notPrincipal] : identity.notPrincipal;
    }
  }

  matches(
    principal: string,
    action: string,
    resource: string,
    principalType?: string,
    context?: Context,
    conditionResolvers?: ConditionResolver
  ): boolean {
    return (
      this.matchPrincipals(principal,principalType,context) &&
      this.matchNotPrincipals(principal, principalType, context) &&
      this.matchActions(action,context) &&
      this.matchNotActions(action,context) &&
      this.matchResources(resource,context) &&
      this.matchNotResources(resource,context) &&
      this.matchConditions(context,conditionResolvers)
    );
  }

  matchPrincipals( principal: string, principalType?: string,context?: object): boolean {
    if(this.principal){
      if(this.principal instanceof Array){
        return !principalType?this.principal.some(a =>
          new Matcher(applyContext(a, context)).match(principal)):true   
      }else{
        if(principalType){
          //const principalValues=typeof this.principal[principalType]==="string" ?[this.principal[principalType]]:this.principal[principalType];
          const principalValues=this.principal[principalType];
          if(this.principal instanceof Object && principalValues instanceof Array)
            return typeof principalValues==="string"?[principalValues].some(a =>
              new Matcher(applyContext(a, context)).match(principal)):
              principalValues.some(a =>
                new Matcher(applyContext(a, context)).match(principal))
        }
      }
    }
    return true;
  }
  
  matchNotPrincipals( principal: string, principalType?: string,context?: object): boolean {
    if(this.notPrincipal){
      if(this.notPrincipal instanceof Array){
        return !principalType?!this.notPrincipal.some(a =>
          new Matcher(applyContext(a, context)).match(principal)):true   
      }else{
        if(principalType){
          //const principalValues=typeof this.principal[principalType]==="string" ?[this.principal[principalType]]:this.principal[principalType];
          const principalValues=this.notPrincipal[principalType];
          if(this.notPrincipal instanceof Object && principalValues instanceof Array)
            return typeof principalValues==="string"?![principalValues].some(a =>
              new Matcher(applyContext(a, context)).match(principal)):
              !principalValues.some(a =>
                new Matcher(applyContext(a, context)).match(principal))
        }
      }
    }
    return true;
  }

  matchActions( action: string, context?: object): boolean {
    return this.action?this.action.some(a =>
      new Matcher(applyContext(a, context)).match(action)):true }

  matchNotActions( action: string, context?: object): boolean {
    return this.notAction?!this.notAction.some(a =>
      new Matcher(applyContext(a, context)).match(action)):true }
  
 
  matchResources( resource: string, context?: object): boolean {
    return this.resource?this.resource.some(a =>
      new Matcher(applyContext(a, context)).match(resource)):true }
  
  matchNotResources( resource: string, context?: object): boolean {
    return this.notResource?!this.notResource.some(a =>
      new Matcher(applyContext(a, context)).match(resource)):true }
}

export { IdentityBasedType, ResourceBasedType, PrincipalMap, Patterns, ConditionResolver, Context };

/*

export class Statement {
  effect: EffectBlock;
  private resource: string[];
  private action: string[];
  private readonly condition?: ConditionBlock;

  constructor({
    effect = 'allow',
    resource,
    action,
    condition,
  }: StatementConfig) {
    this.effect = effect;
    this.resource = typeof resource === 'string' ? [resource] : resource;
    this.action = typeof action === 'string' ? [action] : action;
    this.condition = condition;
  }

  matches(
    action: string,
    resource: string,
    context?: object,
    conditionResolvers?: ConditionResolver
  ): boolean {
    return (
      this.action.some(a =>
        new Matcher(applyContext(a, context)).match(action)
      ) &&
      this.resource.some(r =>
        new Matcher(applyContext(r, context)).match(resource)
      ) &&
      (conditionResolvers && this.condition && context
        ? Object.keys(this.condition).every(condition =>
            Object.keys(
              this.condition ? this.condition[condition] : {}
            ).every(path =>
              conditionResolvers[condition](
                getValueFromPath(context, path),
                this.condition ? this.condition[condition][path] : ''
              )
            )
          )
        : true)
    );
  }
}
*/
declare type EffectBlock = 'allow' | 'deny';
declare type Patterns = string[] | string;
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
declare type ConditionKey = string | number | boolean;
interface Context {
    [key: string]: ConditionKey | Context | string[] | number[];
}
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
}
declare type Resolver = (data: any, expected: any) => boolean;
interface ConditionResolver {
    [key: string]: Resolver;
}
interface MatchConditionInterface {
    context?: Context;
    conditionResolver?: ConditionResolver;
}
interface MatchActionBasedInterface extends MatchConditionInterface {
    action: string;
}
interface MatchIdentityBasedInterface extends MatchActionBasedInterface {
    resource: string;
}
interface MatchResourceBasedInterface extends MatchActionBasedInterface {
    principal?: string;
    principalType?: string;
    resource?: string;
}
interface EvaluateActionBasedInterface {
    action: string;
    context?: Context;
}
interface EvaluateIdentityBasedInterface extends EvaluateActionBasedInterface {
    resource: string;
}
interface EvaluateResourceBasedInterface extends EvaluateActionBasedInterface {
    principal?: string;
    principalType?: string;
    resource?: string;
}
declare type ActionBasedType = StatementInterface & (ActionBlock | NotActionBlock);
declare type IdentityBasedType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock);
declare type ResourceBasedType = StatementInterface & (OptionalPrincipalBlock | OptionalNotPrincipalBlock) & (ActionBlock | NotActionBlock) & (OptionalResourceBlock | OptionalNotResourceBlock);
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
declare function applyContext(str: string, context?: Context): string;

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
declare function getValueFromPath<T>(object: Record<PropertyKey, unknown>, path: Array<T> | string, defaultValue?: unknown): any;

declare class Statement {
    protected sid: string;
    protected readonly condition?: ConditionBlock;
    effect: EffectBlock;
    constructor({ sid, effect, condition }: StatementInterface);
    matchConditions(this: Statement, { context, conditionResolver }: MatchConditionInterface): boolean;
}

declare class ActionBased extends Statement {
    private action?;
    private notAction?;
    private statement;
    constructor(action: ActionBasedType);
    getStatement(this: ActionBased): ActionBasedType;
    matches(this: ActionBased, { action, context, conditionResolver }: MatchActionBasedInterface): boolean;
    private checkAndAssignActions;
    private matchActions;
    private matchNotActions;
}

declare class IdentityBased extends Statement {
    private resource?;
    private action?;
    private notResource?;
    private notAction?;
    private statement;
    constructor(identity: IdentityBasedType);
    getStatement(this: IdentityBased): IdentityBasedType;
    matches(this: IdentityBased, { action, resource, context, conditionResolver }: MatchIdentityBasedInterface): boolean;
    private checkAndAssignActions;
    private checkAndAssignResources;
    private matchActions;
    private matchNotActions;
    private matchResources;
    private matchNotResources;
}

declare class ResourceBased extends Statement {
    private principal?;
    private resource?;
    private action?;
    private notPrincipal?;
    private notResource?;
    private notAction?;
    private statement;
    private hasPrincipals;
    private hasResources;
    constructor(identity: ResourceBasedType);
    getStatement(this: ResourceBased): ResourceBasedType;
    matches(this: ResourceBased, { principal, action, resource, principalType, context, conditionResolver }: MatchResourceBasedInterface): boolean;
    private matchPrincipalAndNotPrincipal;
    private matchResourceAndNotResource;
    private checkAndAssignActions;
    private checkAndAssignPrincipals;
    private checkAndAssignResources;
    private matchPrincipals;
    private matchNotPrincipals;
    private matchActions;
    private matchNotActions;
    private matchResources;
    private matchNotResources;
}

declare class Policy {
    protected context?: Context;
    protected conditionResolver?: ConditionResolver;
    constructor({ context, conditionResolver }: MatchConditionInterface);
    setContext(this: Policy, context: Context): void;
    getContext(this: Policy): Context | undefined;
    setConditionResolver(this: Policy, conditionResolver: ConditionResolver): void;
    getConditionResolver(this: Policy): ConditionResolver | undefined;
}

interface ActionBasedPolicyInterface {
    statements: ActionBasedType[];
    conditionResolver?: ConditionResolver;
    context?: Context;
}
declare class ActionBasedPolicy extends Policy {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: ActionBasedPolicyInterface);
    getStatements(this: ActionBasedPolicy): ActionBasedType[];
    evaluate(this: ActionBasedPolicy, { action, context }: EvaluateActionBasedInterface): boolean;
    can(this: ActionBasedPolicy, { action, context }: EvaluateActionBasedInterface): boolean;
    cannot(this: ActionBasedPolicy, { action, context }: EvaluateActionBasedInterface): boolean;
    generateProxy<T extends object, U extends keyof T>(this: ActionBasedPolicy, obj: T, options?: ProxyOptions): T;
}

interface IdentityBasedPolicyInterface {
    statements: IdentityBasedType[];
    conditionResolver?: ConditionResolver;
    context?: Context;
}
declare class IdentityBasedPolicy extends Policy {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: IdentityBasedPolicyInterface);
    getStatements(this: IdentityBasedPolicy): IdentityBasedType[];
    evaluate(this: IdentityBasedPolicy, { action, resource, context }: EvaluateIdentityBasedInterface): boolean;
    can(this: IdentityBasedPolicy, { action, resource, context }: EvaluateIdentityBasedInterface): boolean;
    cannot(this: IdentityBasedPolicy, { action, resource, context }: EvaluateIdentityBasedInterface): boolean;
}

interface ResourceBasedPolicyInterface {
    statements: ResourceBasedType[];
    conditionResolver?: ConditionResolver;
    context?: Context;
}
declare class ResourceBasedPolicy extends Policy {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: ResourceBasedPolicyInterface);
    getStatements(this: ResourceBasedPolicy): ResourceBasedType[];
    evaluate(this: ResourceBasedPolicy, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface): boolean;
    can(this: ResourceBasedPolicy, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface): boolean;
    cannot(this: ResourceBasedPolicy, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface): boolean;
}

export { ActionBased, ActionBasedPolicy, ActionBasedPolicyInterface, IdentityBased, IdentityBasedPolicy, ResourceBased, ResourceBasedPolicy, applyContext, getValueFromPath };

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
declare function applyContext<T extends object>(str: string, context?: T): string;

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
declare function getValueFromPath<T, U extends object>(object: U, path: Array<T> | string, defaultValue?: unknown): any;

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
declare type ConditionBlock = Record<string, Record<string, unknown>>;
interface StatementInterface {
    sid?: string;
    effect?: EffectBlock;
    condition?: ConditionBlock;
}
declare type Resolver = (data: any, expected: any) => boolean;
interface ConditionResolver {
    [key: string]: Resolver;
}
interface MatchConditionInterface<T extends object> {
    context?: T;
    conditionResolver?: ConditionResolver;
}
interface MatchActionBasedInterface<T extends object> extends MatchConditionInterface<T> {
    action: string;
}
interface MatchIdentityBasedInterface<T extends object> extends MatchActionBasedInterface<T> {
    resource: string;
}
interface MatchResourceBasedInterface<T extends object> extends MatchActionBasedInterface<T> {
    principal?: string;
    principalType?: string;
    resource?: string;
}
interface EvaluateActionBasedInterface<T extends object> {
    action: string;
    context?: T;
}
interface EvaluateIdentityBasedInterface<T extends object> extends EvaluateActionBasedInterface<T> {
    resource: string;
}
interface EvaluateResourceBasedInterface<T extends object> extends EvaluateActionBasedInterface<T> {
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

declare abstract class Statement<T extends object> {
    protected sid: string;
    protected readonly condition?: ConditionBlock;
    effect: EffectBlock;
    constructor({ sid, effect, condition }: StatementInterface);
    matchConditions(this: Statement<T>, { context, conditionResolver }: MatchConditionInterface<T>): boolean;
}

declare class ActionBased<T extends object> extends Statement<T> {
    private action?;
    private notAction?;
    private statement;
    constructor(action: ActionBasedType);
    getStatement(this: ActionBased<T>): ActionBasedType;
    matches(this: ActionBased<T>, { action, context, conditionResolver }: MatchActionBasedInterface<T>): boolean;
    private checkAndAssignActions;
    private matchActions;
    private matchNotActions;
}

declare class IdentityBased<T extends object> extends Statement<T> {
    private resource?;
    private action?;
    private notResource?;
    private notAction?;
    private statement;
    constructor(identity: IdentityBasedType);
    getStatement(this: IdentityBased<T>): IdentityBasedType;
    matches(this: IdentityBased<T>, { action, resource, context, conditionResolver }: MatchIdentityBasedInterface<T>): boolean;
    private checkAndAssignActions;
    private checkAndAssignResources;
    private matchActions;
    private matchNotActions;
    private matchResources;
    private matchNotResources;
}

declare class ResourceBased<T extends object> extends Statement<T> {
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
    getStatement(this: ResourceBased<T>): ResourceBasedType;
    matches(this: ResourceBased<T>, { principal, action, resource, principalType, context, conditionResolver }: MatchResourceBasedInterface<T>): boolean;
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

declare class Policy<T extends object> {
    protected context?: T;
    protected conditionResolver?: ConditionResolver;
    constructor({ context, conditionResolver }: MatchConditionInterface<T>);
    setContext(this: Policy<T>, context: T): void;
    getContext(this: Policy<T>): T | undefined;
    setConditionResolver(this: Policy<T>, conditionResolver: ConditionResolver): void;
    getConditionResolver(this: Policy<T>): ConditionResolver | undefined;
}

interface ActionBasedPolicyInterface<T extends object> {
    statements: ActionBasedType[];
    conditionResolver?: ConditionResolver;
    context?: T;
}
declare class ActionBasedPolicy<W extends object> extends Policy<W> {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: ActionBasedPolicyInterface<W>);
    getStatements(this: ActionBasedPolicy<W>): ActionBasedType[];
    evaluate(this: ActionBasedPolicy<W>, { action, context }: EvaluateActionBasedInterface<W>): boolean;
    can(this: ActionBasedPolicy<W>, { action, context }: EvaluateActionBasedInterface<W>): boolean;
    cannot(this: ActionBasedPolicy<W>, { action, context }: EvaluateActionBasedInterface<W>): boolean;
    generateProxy<T extends object, U extends keyof T>(this: ActionBasedPolicy<W>, obj: T, options?: ProxyOptions): T;
}

interface IdentityBasedPolicyInterface<T extends object> {
    statements: IdentityBasedType[];
    conditionResolver?: ConditionResolver;
    context?: T;
}
declare class IdentityBasedPolicy<T extends object> extends Policy<T> {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: IdentityBasedPolicyInterface<T>);
    getStatements(this: IdentityBasedPolicy<T>): IdentityBasedType[];
    evaluate(this: IdentityBasedPolicy<T>, { action, resource, context }: EvaluateIdentityBasedInterface<T>): boolean;
    can(this: IdentityBasedPolicy<T>, { action, resource, context }: EvaluateIdentityBasedInterface<T>): boolean;
    cannot(this: IdentityBasedPolicy<T>, { action, resource, context }: EvaluateIdentityBasedInterface<T>): boolean;
}

interface ResourceBasedPolicyInterface<T extends object> {
    statements: ResourceBasedType[];
    conditionResolver?: ConditionResolver;
    context?: T;
}
declare class ResourceBasedPolicy<T extends object> extends Policy<T> {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: ResourceBasedPolicyInterface<T>);
    getStatements(this: ResourceBasedPolicy<T>): ResourceBasedType[];
    evaluate(this: ResourceBasedPolicy<T>, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface<T>): boolean;
    can(this: ResourceBasedPolicy<T>, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface<T>): boolean;
    cannot(this: ResourceBasedPolicy<T>, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface<T>): boolean;
}

export { ActionBased, ActionBasedPolicy, ActionBasedPolicyInterface, IdentityBased, IdentityBasedPolicy, ResourceBased, ResourceBasedPolicy, applyContext, getValueFromPath };

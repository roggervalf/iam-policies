export declare class ActionBased<T extends object> extends Statement<T> {
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

export declare class ActionBasedPolicy<T extends object> extends Policy<T, ActionBasedType> {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: ActionBasedPolicyInterface<T>);
    addStatement(this: ActionBasedPolicy<T>, statement: ActionBasedType): void;
    getStatements(this: ActionBasedPolicy<T>): ActionBasedType[];
    evaluate(this: ActionBasedPolicy<T>, { action, context }: EvaluateActionBasedInterface<T>): boolean;
    can(this: ActionBasedPolicy<T>, { action, context }: EvaluateActionBasedInterface<T>): boolean;
    whyCan(this: ActionBasedPolicy<T>, { action, context }: EvaluateActionBasedInterface<T>): ActionBasedType[];
    cannot(this: ActionBasedPolicy<T>, { action, context }: EvaluateActionBasedInterface<T>): boolean;
    whyCannot(this: ActionBasedPolicy<T>, { action, context }: EvaluateActionBasedInterface<T>): ActionBasedType[];
    generateProxy<U extends object>(this: ActionBasedPolicy<T>, obj: U, options?: ProxyOptions): U;
}

export declare interface ActionBasedPolicyInterface<T extends object> {
    statements: ActionBasedType[];
    conditionResolver?: ConditionResolver;
    context?: T;
}

declare type ActionBasedType = StatementInterface & (ActionBlock | NotActionBlock);

declare interface ActionBlock {
    action: Patterns;
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
export declare function applyContext<T extends object>(str: string, context?: T): string;

declare type ConditionBlock = Record<string, Record<string, unknown>>;

declare interface ConditionResolver {
    [key: string]: Resolver;
}

declare type EffectBlock = 'allow' | 'deny';

declare interface EvaluateActionBasedInterface<T extends object> {
    action: string;
    context?: T;
}

declare interface EvaluateIdentityBasedInterface<T extends object> extends EvaluateActionBasedInterface<T> {
    resource: string;
}

declare interface EvaluateResourceBasedInterface<T extends object> extends EvaluateActionBasedInterface<T> {
    principal?: string;
    principalType?: string;
    resource?: string;
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
export declare function getValueFromPath<T, U extends object>(object: U, path: Array<T> | string, defaultValue?: unknown): any;

export declare class IdentityBased<T extends object> extends Statement<T> {
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

export declare class IdentityBasedPolicy<T extends object> extends Policy<T, IdentityBasedType> {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: IdentityBasedPolicyInterface<T>);
    addStatement(this: IdentityBasedPolicy<T>, statement: IdentityBasedType): void;
    getStatements(this: IdentityBasedPolicy<T>): IdentityBasedType[];
    evaluate(this: IdentityBasedPolicy<T>, { action, resource, context }: EvaluateIdentityBasedInterface<T>): boolean;
    can(this: IdentityBasedPolicy<T>, { action, resource, context }: EvaluateIdentityBasedInterface<T>): boolean;
    cannot(this: IdentityBasedPolicy<T>, { action, resource, context }: EvaluateIdentityBasedInterface<T>): boolean;
}

declare interface IdentityBasedPolicyInterface<T extends object> {
    statements: IdentityBasedType[];
    conditionResolver?: ConditionResolver;
    context?: T;
}

declare type IdentityBasedType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock);

declare interface MatchActionBasedInterface<T extends object> extends MatchConditionInterface<T> {
    action: string;
}

declare interface MatchConditionInterface<T extends object> {
    context?: T;
    conditionResolver?: ConditionResolver;
}

declare interface MatchIdentityBasedInterface<T extends object> extends MatchActionBasedInterface<T> {
    resource: string;
}

declare interface MatchResourceBasedInterface<T extends object> extends MatchActionBasedInterface<T> {
    principal?: string;
    principalType?: string;
    resource?: string;
}

declare interface NotActionBlock {
    notAction: Patterns;
}

declare interface NotResourceBlock {
    notResource: Patterns;
}

declare interface OptionalNotPrincipalBlock {
    notPrincipal?: PrincipalMap | Patterns;
}

declare interface OptionalNotResourceBlock {
    notResource?: Patterns;
}

declare interface OptionalPrincipalBlock {
    principal?: PrincipalMap | Patterns;
}

declare interface OptionalResourceBlock {
    resource?: Patterns;
}

declare type Patterns = string[] | string;

declare abstract class Policy<T extends object, U> {
    protected context?: T;
    protected conditionResolver?: ConditionResolver;
    constructor({ context, conditionResolver }: MatchConditionInterface<T>);
    setContext(this: Policy<T, U>, context: T): void;
    getContext(this: Policy<T, U>): T | undefined;
    setConditionResolver(this: Policy<T, U>, conditionResolver: ConditionResolver): void;
    getConditionResolver(this: Policy<T, U>): ConditionResolver | undefined;
    abstract getStatements(this: Policy<T, U>): U[];
}

declare interface PrincipalMap {
    [key: string]: Patterns;
}

declare interface ProxyOptions {
    get?: {
        allow?: boolean;
        propertyMap?: Record<string, string>;
    };
    set?: {
        allow?: boolean;
        propertyMap?: Record<string, string>;
    };
}

declare type Resolver = (data: any, expected: any) => boolean;

export declare class ResourceBased<T extends object> extends Statement<T> {
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

export declare class ResourceBasedPolicy<T extends object> extends Policy<T, ResourceBasedType> {
    private denyStatements;
    private allowStatements;
    private statements;
    constructor({ statements, conditionResolver, context }: ResourceBasedPolicyInterface<T>);
    addStatement(this: ResourceBasedPolicy<T>, statement: ResourceBasedType): void;
    getStatements(this: ResourceBasedPolicy<T>): ResourceBasedType[];
    evaluate(this: ResourceBasedPolicy<T>, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface<T>): boolean;
    can(this: ResourceBasedPolicy<T>, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface<T>): boolean;
    cannot(this: ResourceBasedPolicy<T>, { principal, action, resource, principalType, context }: EvaluateResourceBasedInterface<T>): boolean;
}

declare interface ResourceBasedPolicyInterface<T extends object> {
    statements: ResourceBasedType[];
    conditionResolver?: ConditionResolver;
    context?: T;
}

declare type ResourceBasedType = StatementInterface & (OptionalPrincipalBlock | OptionalNotPrincipalBlock) & (ActionBlock | NotActionBlock) & (OptionalResourceBlock | OptionalNotResourceBlock);

declare interface ResourceBlock {
    resource: Patterns;
}

declare abstract class Statement<T extends object> {
    protected sid: string;
    protected readonly condition?: ConditionBlock;
    effect: EffectBlock;
    constructor({ sid, effect, condition }: StatementInterface);
    matchConditions(this: Statement<T>, { context, conditionResolver }: MatchConditionInterface<T>): boolean;
    private evaluateCondition;
}

declare interface StatementInterface {
    sid?: string;
    effect?: EffectBlock;
    condition?: ConditionBlock;
}

export { }

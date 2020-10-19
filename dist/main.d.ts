/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
declare function castPath<T>(value: any, object: object): Array<T>;
/**
 * The base implementation of `get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
declare function baseGet<T>(object: object, path: Array<T> | string): any;
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
declare function getValueFromPath<T>(object: object, path: Array<T> | string, defaultValue?: any): any;

declare type EffectBlock = 'allow' | 'deny';
declare type Patterns = string[] | string;
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
interface MatchResourceBasedInterface extends MatchIdentityBasedInterface {
    principal: string;
    principalType?: string;
}
interface EvaluateActionBasedInterface {
    action: string;
    context?: Context;
}
interface EvaluateIdentityBasedInterface extends EvaluateActionBasedInterface {
    resource: string;
}
interface EvaluateResourceBasedInterface extends EvaluateIdentityBasedInterface {
    principal: string;
    principalType?: string;
}
declare type ActionBasedType = StatementInterface & (ActionBlock | NotActionBlock);
declare type IdentityBasedType = StatementInterface & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock);
declare type ResourceBasedType = StatementInterface & (PrincipalBlock | NotPrincipalBlock) & (ActionBlock | NotActionBlock) & (ResourceBlock | NotResourceBlock | {});

declare function applyContext(str: string, context?: Context): string;
declare class Statement {
    protected sid: string;
    protected readonly condition?: ConditionBlock;
    effect: EffectBlock;
    constructor({ sid, effect, condition }: StatementInterface);
    matchConditions({ context, conditionResolver }: MatchConditionInterface): boolean;
}

declare class ActionBased extends Statement {
    private action?;
    private notAction?;
    private statement;
    constructor(action: ActionBasedType);
    getStatement(): ActionBasedType;
    matches({ action, context, conditionResolver }: MatchActionBasedInterface): boolean;
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
    getStatement(): IdentityBasedType;
    matches({ action, resource, context, conditionResolver }: MatchIdentityBasedInterface): boolean;
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
    getStatement(): ResourceBasedType;
    matches({ principal, action, resource, principalType, context, conditionResolver }: MatchResourceBasedInterface): boolean;
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
    setContext(context: Context): void;
    getContext(): Context | undefined;
    setConditionResolver(conditionResolver: ConditionResolver): void;
    getConditionResolver(): ConditionResolver | undefined;
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
    getStatements(): ActionBasedType[];
    evaluate({ action, context }: EvaluateActionBasedInterface): boolean;
    can({ action, context }: EvaluateActionBasedInterface): boolean;
    cannot({ action, context }: EvaluateActionBasedInterface): boolean;
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
    getStatements(): IdentityBasedType[];
    evaluate({ action, resource, context }: EvaluateIdentityBasedInterface): boolean;
    can({ action, resource, context }: EvaluateIdentityBasedInterface): boolean;
    cannot({ action, resource, context }: EvaluateIdentityBasedInterface): boolean;
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
    getStatements(): ResourceBasedType[];
    evaluate({ principal, action, resource, principalType, context }: EvaluateResourceBasedInterface): boolean;
    can({ principal, action, resource, principalType, context }: EvaluateResourceBasedInterface): boolean;
    cannot({ principal, action, resource, principalType, context }: EvaluateResourceBasedInterface): boolean;
}

export { ActionBased, ActionBasedPolicy, IdentityBased, IdentityBasedPolicy, ResourceBased, ResourceBasedPolicy, Statement, applyContext, baseGet, castPath, getValueFromPath };

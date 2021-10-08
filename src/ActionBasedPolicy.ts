import {
  ActionBasedType,
  ConditionResolver,
  EvaluateActionBasedInterface,
  ProxyOptions
} from './types';
import { ActionBased } from './ActionBasedStatement';
import { Policy } from './Policy';

export interface ActionBasedPolicyInterface<T extends object> {
  statements: ActionBasedType[];
  conditionResolver?: ConditionResolver;
  context?: T;
}

export class ActionBasedPolicy<T extends object> extends Policy<
  T,
  ActionBasedType
> {
  private denyStatements: ActionBased<T>[];
  private allowStatements: ActionBased<T>[];
  private statements: ActionBasedType[];

  constructor({
    statements,
    conditionResolver,
    context
  }: ActionBasedPolicyInterface<T>) {
    super({ context, conditionResolver });
    const statementInstances = statements.map(
      (statement) => new ActionBased(statement)
    );
    this.allowStatements = statementInstances.filter(
      (s) => s.effect === 'allow'
    );
    this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
    this.statements = statementInstances.map((statement) =>
      statement.getStatement()
    );
  }

  addStatement(this: ActionBasedPolicy<T>, statement: ActionBasedType): void {
    const statementInstance = new ActionBased(statement);
    if (statementInstance.effect === 'allow') {
      this.allowStatements.push(statementInstance);
    } else {
      this.denyStatements.push(statementInstance);
    }
    this.statements.push(statementInstance.getStatement());
  }

  getStatements(this: ActionBasedPolicy<T>): ActionBasedType[] {
    return this.statements;
  }

  evaluate(
    this: ActionBasedPolicy<T>,
    { action, context }: EvaluateActionBasedInterface<T>
  ): boolean {
    const args = { action, context };
    return !this.cannot(args) && this.can(args);
  }

  can(
    this: ActionBasedPolicy<T>,
    { action, context }: EvaluateActionBasedInterface<T>
  ): boolean {
    return this.allowStatements.some((s) =>
      s.matches({
        action,
        context: context || this.context,
        conditionResolver: this.conditionResolver
      })
    );
  }

  cannot(
    this: ActionBasedPolicy<T>,
    { action, context }: EvaluateActionBasedInterface<T>
  ): boolean {
    return this.denyStatements.some((s) =>
      s.matches({
        action,
        context: context || this.context,
        conditionResolver: this.conditionResolver
      })
    );
  }

  generateProxy<U extends object>(
    this: ActionBasedPolicy<T>,
    obj: U,
    options: ProxyOptions = {}
  ): U {
    const { get = {}, set = {} } = options;
    const { allow: allowGet = true, propertyMap: propertyMapGet = {} } = get;
    const { allow: allowSet = true, propertyMap: propertyMapSet = {} } = set;
    const handler = {
      ...(allowGet
        ? {
            get: (target: U, prop: string | symbol): any => {
              const property = Reflect.has(propertyMapGet, prop)
                ? Reflect.get(propertyMapGet, prop)
                : prop;
              if (this.evaluate({ action: property })) {
                return Reflect.get(target, prop);
              } else {
                throw new Error(`Unauthorize to get ${String(prop)} property`);
              }
            }
          }
        : {}),
      ...(allowSet
        ? {
            set: (target: U, prop: string | symbol, value: any): boolean => {
              const property = Reflect.has(propertyMapSet, prop)
                ? Reflect.get(propertyMapSet, prop)
                : prop;
              if (this.evaluate({ action: property })) {
                return Reflect.set(target, prop, value);
              } else {
                throw new Error(`Unauthorize to set ${String(prop)} property`);
              }
            }
          }
        : {})
    };

    return new Proxy(obj, handler);
  }
}

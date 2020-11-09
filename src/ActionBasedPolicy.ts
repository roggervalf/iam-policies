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

export class ActionBasedPolicy<W extends object> extends Policy<W> {
  private denyStatements: ActionBased<W>[];
  private allowStatements: ActionBased<W>[];
  private statements: ActionBasedType[];

  constructor({
    statements,
    conditionResolver,
    context
  }: ActionBasedPolicyInterface<W>) {
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

  getStatements(this: ActionBasedPolicy<W>): ActionBasedType[] {
    return this.statements;
  }

  evaluate(
    this: ActionBasedPolicy<W>,
    { action, context }: EvaluateActionBasedInterface<W>
  ): boolean {
    const args = { action, context };
    return !this.cannot(args) && this.can(args);
  }

  can(
    this: ActionBasedPolicy<W>,
    { action, context }: EvaluateActionBasedInterface<W>
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
    this: ActionBasedPolicy<W>,
    { action, context }: EvaluateActionBasedInterface<W>
  ): boolean {
    return this.denyStatements.some((s) =>
      s.matches({
        action,
        context: context || this.context,
        conditionResolver: this.conditionResolver
      })
    );
  }

  generateProxy<T extends object, U extends keyof T>(
    this: ActionBasedPolicy<W>,
    obj: T,
    options: ProxyOptions = {}
  ): T {
    const { get = {}, set = {} } = options;
    const { allow: allowGet = true, propertyMap: propertyMapGet = {} } = get;
    const { allow: allowSet = true, propertyMap: propertyMapSet = {} } = set;
    const handler = {
      ...(allowGet
        ? {
            get: (target: T, prop: U): any => {
              if (prop in target) {
                if (typeof prop === 'string') {
                  const property = propertyMapGet[prop] || prop;
                  if (this.evaluate({ action: property })) return target[prop];
                  throw new Error(`Unauthorize to get ${prop} property`);
                }
              }
              return target[prop];
            }
          }
        : {}),
      ...(allowSet
        ? {
            set: (target: T, prop: U, value: any): boolean => {
              if (typeof prop === 'string') {
                const property = propertyMapSet[prop] || prop;
                if (this.evaluate({ action: property })) {
                  target[prop] = value;
                  return true;
                } else throw new Error(`Unauthorize to set ${prop} property`);
              }
              return true;
            }
          }
        : {})
    };

    return new Proxy(obj, handler);
  }
}

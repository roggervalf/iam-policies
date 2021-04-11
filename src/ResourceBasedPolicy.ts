import {
  ConditionResolver,
  EvaluateResourceBasedInterface,
  ResourceBasedType
} from './types';
import { ResourceBased } from './ResourceBasedStatement';
import { Policy } from './Policy';

interface ResourceBasedPolicyInterface<T extends object> {
  statements: ResourceBasedType[];
  conditionResolver?: ConditionResolver;
  context?: T;
}

export class ResourceBasedPolicy<T extends object> extends Policy<
  T,
  ResourceBasedType
> {
  private denyStatements: ResourceBased<T>[];
  private allowStatements: ResourceBased<T>[];
  private statements: ResourceBasedType[];

  constructor({
    statements,
    conditionResolver,
    context
  }: ResourceBasedPolicyInterface<T>) {
    super({ context, conditionResolver });
    const statementInstances = statements.map(
      (statement) => new ResourceBased(statement)
    );
    this.allowStatements = statementInstances.filter(
      (s) => s.effect === 'allow'
    );
    this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
    this.statements = statementInstances.map((statement) =>
      statement.getStatement()
    );
  }

  addStatement(
    this: ResourceBasedPolicy<T>,
    statement: ResourceBasedType
  ): void {
    const statementInstance = new ResourceBased(statement);
    if (statementInstance.effect === 'allow') {
      this.allowStatements.push(statementInstance);
    } else {
      this.denyStatements.push(statementInstance);
    }
    this.statements.push(statementInstance.getStatement());
  }

  getStatements(this: ResourceBasedPolicy<T>): ResourceBasedType[] {
    return this.statements;
  }

  evaluate(
    this: ResourceBasedPolicy<T>,
    {
      principal,
      action,
      resource,
      principalType,
      context
    }: EvaluateResourceBasedInterface<T>
  ): boolean {
    const args = { principal, action, resource, principalType, context };
    return !this.cannot(args) && this.can(args);
  }

  can(
    this: ResourceBasedPolicy<T>,
    {
      principal,
      action,
      resource,
      principalType,
      context
    }: EvaluateResourceBasedInterface<T>
  ): boolean {
    return this.allowStatements.some((s) =>
      s.matches({
        principal,
        action,
        resource,
        principalType,
        context: context || this.context,
        conditionResolver: this.conditionResolver
      })
    );
  }

  cannot(
    this: ResourceBasedPolicy<T>,
    {
      principal,
      action,
      resource,
      principalType,
      context
    }: EvaluateResourceBasedInterface<T>
  ): boolean {
    return this.denyStatements.some((s) =>
      s.matches({
        principal,
        action,
        resource,
        principalType,
        context: context || this.context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

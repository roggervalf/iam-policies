import {
  ConditionResolver,
  EvaluateIdentityBasedInterface,
  IdentityBasedType
} from './types';
import { IdentityBased } from './IdentityBasedStatement';
import { Policy } from './Policy';

interface IdentityBasedPolicyInterface<T extends object> {
  statements: IdentityBasedType[];
  conditionResolver?: ConditionResolver;
  context?: T;
}

export class IdentityBasedPolicy<T extends object> extends Policy<T> {
  private denyStatements: IdentityBased<T>[];
  private allowStatements: IdentityBased<T>[];
  private statements: IdentityBasedType[];

  constructor({
    statements,
    conditionResolver,
    context
  }: IdentityBasedPolicyInterface<T>) {
    super({ context, conditionResolver });
    const statementInstances = statements.map(
      (statement) => new IdentityBased(statement)
    );
    this.allowStatements = statementInstances.filter(
      (s) => s.effect === 'allow'
    );
    this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
    this.statements = statementInstances.map((statement) =>
      statement.getStatement()
    );
  }

  getStatements(this: IdentityBasedPolicy<T>): IdentityBasedType[] {
    return this.statements;
  }

  evaluate(
    this: IdentityBasedPolicy<T>,
    { action, resource, context }: EvaluateIdentityBasedInterface<T>
  ): boolean {
    const args = { action, resource, context };
    return !this.cannot(args) && this.can(args);
  }

  can(
    this: IdentityBasedPolicy<T>,
    { action, resource, context }: EvaluateIdentityBasedInterface<T>
  ): boolean {
    return this.allowStatements.some((s) =>
      s.matches({
        action,
        resource,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }

  cannot(
    this: IdentityBasedPolicy<T>,
    { action, resource, context }: EvaluateIdentityBasedInterface<T>
  ): boolean {
    return this.denyStatements.some((s) =>
      s.matches({
        action,
        resource,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

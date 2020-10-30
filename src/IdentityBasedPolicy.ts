import {
  ConditionResolver,
  Context,
  EvaluateIdentityBasedInterface,
  IdentityBasedType
} from './types';
import { IdentityBased } from './IdentityBasedStatement';
import { Policy } from './Policy';

interface IdentityBasedPolicyInterface {
  statements: IdentityBasedType[];
  conditionResolver?: ConditionResolver;
  context?: Context;
}

export class IdentityBasedPolicy extends Policy {
  private denyStatements: IdentityBased[];
  private allowStatements: IdentityBased[];
  private statements: IdentityBasedType[];

  constructor({
    statements,
    conditionResolver,
    context
  }: IdentityBasedPolicyInterface) {
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

  getStatements(this: IdentityBasedPolicy): IdentityBasedType[] {
    return this.statements;
  }

  evaluate(
    this: IdentityBasedPolicy,
    { action, resource, context }: EvaluateIdentityBasedInterface
  ): boolean {
    const args = { action, resource, context };
    return !this.cannot(args) && this.can(args);
  }

  can(
    this: IdentityBasedPolicy,
    { action, resource, context }: EvaluateIdentityBasedInterface
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
    this: IdentityBasedPolicy,
    { action, resource, context }: EvaluateIdentityBasedInterface
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

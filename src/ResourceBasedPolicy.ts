import {
  ConditionResolver,
  Context,
  EvaluateResourceBasedInterface,
  ResourceBasedType
} from './types';
import { ResourceBased } from './ResourceBasedStatement';
import { Policy } from './Policy';

interface ResourceBasedPolicyInterface {
  statements: ResourceBasedType[];
  conditionResolver?: ConditionResolver;
  context?: Context;
}

export class ResourceBasedPolicy extends Policy {
  private denyStatements: ResourceBased[];
  private allowStatements: ResourceBased[];
  private statements: ResourceBasedType[];

  constructor({
    statements,
    conditionResolver,
    context
  }: ResourceBasedPolicyInterface) {
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

  getStatements(this: ResourceBasedPolicy): ResourceBasedType[] {
    return this.statements;
  }

  evaluate(
    this: ResourceBasedPolicy,
    {
      principal,
      action,
      resource,
      principalType,
      context
    }: EvaluateResourceBasedInterface
  ): boolean {
    const args = { principal, action, resource, principalType, context };
    return !this.cannot(args) && this.can(args);
  }

  can(
    this: ResourceBasedPolicy,
    {
      principal,
      action,
      resource,
      principalType,
      context
    }: EvaluateResourceBasedInterface
  ): boolean {
    return this.allowStatements.some((s) =>
      s.matches({
        principal,
        action,
        resource,
        principalType,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }

  cannot(
    this: ResourceBasedPolicy,
    {
      principal,
      action,
      resource,
      principalType,
      context
    }: EvaluateResourceBasedInterface
  ): boolean {
    return this.denyStatements.some((s) =>
      s.matches({
        principal,
        action,
        resource,
        principalType,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

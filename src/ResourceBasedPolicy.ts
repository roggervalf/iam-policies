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
  private conditionResolver?: ConditionResolver;
  private statements: ResourceBasedType[];
  constructor({
    statements,
    conditionResolver,
    context
  }: IdentityBasedPolicyInterface) {
    super({ context, conditionResolver });
    const statementInstances = statements.map(
      (statement) => new ResourceBased(statement)
    );
    this.allowStatements = statementInstances.filter(
      (s) => s.effect === 'allow'
    );
    this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
    this.conditionResolver = conditionResolver;
    this.statements = statementInstances.map((statement) =>
      statement.getStatement()
    );
  }

  getStatements(): ResourceBasedType[] {
    return this.statements;
  }

  evaluate({
    principal,
    action,
    resource,
    principalType,
    context
  }: EvaluateResourceBasedInterface): boolean {
    const args = { principal, action, resource, principalType, context };
    return !this.cannot(args) && this.can(args);
  }

  can({
    principal,
    action,
    resource,
    principalType,
    context
  }: EvaluateResourceBasedInterface): boolean {
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

  cannot({
    principal,
    action,
    resource,
    principalType,
    context
  }: EvaluateResourceBasedInterface): boolean {
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

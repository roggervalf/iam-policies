import {
  ResourceBasedType,
  EvaluateResourceBasedInterface,
  ConditionResolver
} from './types';
import { ResourceBased } from './ResourceBasedStatement';

export class ResourceBasedPolicy {
  private denyStatements: ResourceBased[];
  private allowStatements: ResourceBased[];
  private conditionResolver?: ConditionResolver;
  private statements: ResourceBasedType[];
  constructor(
    config: ResourceBasedType[],
    conditionResolver?: ConditionResolver
  ) {
    const statementInstances = config.map(
      statement => new ResourceBased(statement)
    );
    this.allowStatements = statementInstances.filter(s => s.effect === 'allow');
    this.denyStatements = statementInstances.filter(s => s.effect === 'deny');
    this.conditionResolver = conditionResolver;
    this.statements = statementInstances.map(statement =>
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
    return this.allowStatements.some(s =>
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
    return this.denyStatements.some(s =>
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

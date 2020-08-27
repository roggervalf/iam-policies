import {
  IdentityBasedType,
  EvaluateIdentityBasedInterface,
  ConditionResolver
} from './types';
import { IdentityBased } from './IdentityBasedStatement';

export class IdentityBasedPolicy {
  private denyStatements: IdentityBased[];
  private allowStatements: IdentityBased[];
  private conditionResolver?: ConditionResolver;
  private statements: IdentityBasedType[];
  constructor(
    config: IdentityBasedType[],
    conditionResolver?: ConditionResolver
  ) {
    const statementInstances = config.map(s => new IdentityBased(s));
    this.allowStatements = statementInstances.filter(s => s.effect === 'allow');
    this.denyStatements = statementInstances.filter(s => s.effect === 'deny');
    this.conditionResolver = conditionResolver;
    this.statements = config;
  }
  getStatements(): IdentityBasedType[] {
    return this.statements;
  }
  evaluate({
    action,
    resource,
    context
  }: EvaluateIdentityBasedInterface): boolean {
    const args = { action, resource, context };
    return !this.cannot(args) && this.can(args);
  }
  can({ action, resource, context }: EvaluateIdentityBasedInterface): boolean {
    return this.allowStatements.some(s =>
      s.matches({
        action,
        resource,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
  cannot({
    action,
    resource,
    context
  }: EvaluateIdentityBasedInterface): boolean {
    return this.denyStatements.some(s =>
      s.matches({
        action,
        resource,
        context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

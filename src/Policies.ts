import {
  IdentityBasedType,
  ResourceBasedType,
  EvaluateIdentityBasedInterface,
  EvaluateResourceBasedInterface,
  ConditionResolver
} from './types';
import { IdentityBased } from './IdentityBasedStatement';
import { ResourceBased } from './ResourceBasedStatement';

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

export class ResourceBasedPolicy {
  private denyStatements: ResourceBased[];
  private allowStatements: ResourceBased[];
  private conditionResolver?: ConditionResolver;
  private statements: ResourceBasedType[];
  constructor(
    config: ResourceBasedType[],
    conditionResolver?: ConditionResolver
  ) {
    const statementInstances = config.map(s => new ResourceBased(s));
    this.allowStatements = statementInstances.filter(s => s.effect === 'allow');
    this.denyStatements = statementInstances.filter(s => s.effect === 'deny');
    this.conditionResolver = conditionResolver;
    this.statements = config;
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

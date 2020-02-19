//import { Statement, StatementInterface, ConditionResolver } from './Statement';
import { IdentityBasedType, ConditionResolver, ResourceBasedType, Context } from './definitions';
import { IdentityBased } from './IdentityBasedStatement';
import { ResourceBased } from './ResourceBasedStatement';

export class IdentityBasedPolicy {
  private denyStatements: IdentityBased[];
  private allowStatements: IdentityBased[];
  private conditionResolvers?: ConditionResolver;
  constructor(
    config: IdentityBasedType[],
    conditionResolvers?: ConditionResolver
  ) {
    const statements = config.map(s => new IdentityBased(s));
    this.allowStatements = statements.filter(s => s.effect === 'allow');
    this.denyStatements = statements.filter(s => s.effect === 'deny');
    this.conditionResolvers = conditionResolvers;
  }
  can(action: string, resource: string, context?: Context): boolean {
    return (
      !this.denyStatements.some(s =>
        s.matches(action, resource, context, this.conditionResolvers)
      ) &&
      this.allowStatements.some(s =>
        s.matches(action, resource, context, this.conditionResolvers)
      )
    );
  }
}

export class ResourceBasedPolicy {
  private denyStatements: ResourceBased[];
  private allowStatements: ResourceBased[];
  private conditionResolvers?: ConditionResolver;
  constructor(
    config: ResourceBasedType[],
    conditionResolvers?: ConditionResolver
  ) {
    const statements = config.map(s => new ResourceBased(s));
    this.allowStatements = statements.filter(s => s.effect === 'allow');
    this.denyStatements = statements.filter(s => s.effect === 'deny');
    this.conditionResolvers = conditionResolvers;
  }
  can(principal: string, action: string, resource: string, principalType?: string, context?: Context): boolean {
    return (
      !this.denyStatements.some(s =>
        s.matches(principal, action, resource, principalType, context, this.conditionResolvers)
      ) &&
      this.allowStatements.some(s =>
        s.matches(principal, action, resource, principalType, context, this.conditionResolvers)
      )
    );
  }
}

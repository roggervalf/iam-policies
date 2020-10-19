import {
  PrincipalMap,
  Context,
  MatchResourceBasedInterface,
  ResourceBasedType
} from './types';
import {
  instanceOfActionBlock,
  instanceOfNotActionBlock,
  instanceOfNotPrincipalBlock,
  instanceOfNotResourceBlock,
  instanceOfPrincipalBlock,
  instanceOfResourceBlock
} from './utils/instanceOfInterfaces';
import { Matcher } from './Matcher';
import { applyContext, Statement } from './Statement';

class ResourceBased extends Statement {
  private principal?: PrincipalMap | string[];
  private resource?: string[];
  private action?: string[];
  private notPrincipal?: PrincipalMap | string[];
  private notResource?: string[];
  private notAction?: string[];
  private statement: ResourceBasedType;
  private hasPrincipals: boolean;
  private hasResources: boolean;

  constructor(identity: ResourceBasedType) {
    super(identity);
    this.hasPrincipals = false;
    this.hasResources = false;
    this.checkAndAssignActions(identity);
    this.checkAndAssignPrincipals(identity);
    this.checkAndAssignResources(identity);
    this.statement = { ...identity, sid: this.sid };
  }

  getStatement(): ResourceBasedType {
    return this.statement;
  }

  matches({
    principal,
    action,
    resource,
    principalType,
    context,
    conditionResolver
  }: MatchResourceBasedInterface): boolean {
    return (
      this.matchPrincipalAndNotPrincipal(principal, principalType, context) &&
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchResourceAndNotResource(resource, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }

  /*valueComing principal noPrincipal
  true        false     false       false
  true        true      false       true or false
  true        false     true        true or false
  false       false     false       true
  false       true      false       false
  false       false     true        false*/
  private matchPrincipalAndNotPrincipal(
    principal?: string,
    principalType?: string,
    context?: Context
  ): boolean {
    if (principal) {
      if (this.hasPrincipals)
        return (
          this.matchPrincipals(principal, principalType, context) &&
          this.matchNotPrincipals(principal, principalType, context)
        );
      return false;
    }
    if (this.hasPrincipals) return false;
    return true;
  }

  /*valueComing resource noResource
  true        false     false       false
  true        true      false       true or false
  true        false     true        true or false
  false       false     false       true
  false       true      false       false
  false       false     true        false*/
  private matchResourceAndNotResource(
    resource?: string,
    context?: Context
  ): boolean {
    if (resource) {
      if (this.hasResources)
        return (
          this.matchResources(resource, context) &&
          this.matchNotResources(resource, context)
        );
      return false;
    }
    if (this.hasResources) return false;
    return true;
  }

  private checkAndAssignActions(identity: ResourceBasedType): void {
    const hasAction = instanceOfActionBlock(identity);
    const hasNotAction = instanceOfNotActionBlock(identity);
    if (hasAction && hasNotAction) {
      throw new TypeError(
        'ResourceBased statement should have an action or a notAction attribute, no both'
      );
    }
    if (!hasAction && !hasNotAction) {
      throw new TypeError(
        'ResourceBased statement should have an action or a notAction attribute'
      );
    }
    if (instanceOfActionBlock(identity)) {
      this.action =
        typeof identity.action === 'string'
          ? [identity.action]
          : identity.action;
    } else {
      this.notAction =
        typeof identity.notAction === 'string'
          ? [identity.notAction]
          : identity.notAction;
    }
  }

  private checkAndAssignPrincipals(identity: ResourceBasedType): void {
    const hasPrincipal = instanceOfPrincipalBlock(identity);
    const hasNotPrincipal = instanceOfNotPrincipalBlock(identity);
    if (hasPrincipal && hasNotPrincipal) {
      throw new TypeError(
        'ResourceBased statement could have a principal or a notPrincipal attribute, no both'
      );
    }
    if (instanceOfPrincipalBlock(identity)) {
      this.principal =
        typeof identity.principal === 'string'
          ? [identity.principal]
          : identity.principal;
      this.hasPrincipals = true;
    } else if (instanceOfNotPrincipalBlock(identity)) {
      this.notPrincipal =
        typeof identity.notPrincipal === 'string'
          ? [identity.notPrincipal]
          : identity.notPrincipal;
      this.hasPrincipals = true;
    }
  }

  private checkAndAssignResources(identity: ResourceBasedType): void {
    const hasResource = instanceOfResourceBlock(identity);
    const hasNotResource = instanceOfNotResourceBlock(identity);
    if (hasResource && hasNotResource) {
      throw new TypeError(
        'ResourceBased statement could have a resource or a notResource attribute, no both'
      );
    }
    if (instanceOfResourceBlock(identity)) {
      this.resource =
        typeof identity.resource === 'string'
          ? [identity.resource]
          : identity.resource;
      this.hasResources = true;
    } else if (instanceOfNotResourceBlock(identity)) {
      this.notResource =
        typeof identity.notResource === 'string'
          ? [identity.notResource]
          : identity.notResource;
      this.hasResources = true;
    }
  }

  private matchPrincipals(
    principal: string,
    principalType?: string,
    context?: Context
  ): boolean {
    if (this.principal) {
      if (this.principal instanceof Array) {
        return principalType
          ? false
          : this.principal.some((a) =>
              new Matcher(applyContext(a, context)).match(principal)
            );
      } else {
        if (principalType) {
          const principalValues = this.principal[principalType];
          if (principalValues instanceof Array) {
            return principalValues.some((a) =>
              new Matcher(applyContext(a, context)).match(principal)
            );
          }
          return new Matcher(applyContext(principalValues, context)).match(
            principal
          );
        }
        return false;
      }
    }
    return true;
  }

  private matchNotPrincipals(
    principal: string,
    principalType?: string,
    context?: Context
  ): boolean {
    if (this.notPrincipal) {
      if (this.notPrincipal instanceof Array) {
        return principalType
          ? true
          : !this.notPrincipal.some((a) =>
              new Matcher(applyContext(a, context)).match(principal)
            );
      } else {
        if (principalType) {
          const principalValues = this.notPrincipal[principalType];
          if (principalValues instanceof Array) {
            return !principalValues.some((a) =>
              new Matcher(applyContext(a, context)).match(principal)
            );
          }
          return !new Matcher(applyContext(principalValues, context)).match(
            principal
          );
        }
        return true;
      }
    }
    return true;
  }

  private matchActions(action: string, context?: Context): boolean {
    return this.action
      ? this.action.some((a) =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  private matchNotActions(action: string, context?: Context): boolean {
    return this.notAction
      ? !this.notAction.some((a) =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  private matchResources(resource: string, context?: Context): boolean {
    return this.resource
      ? this.resource.some((a) =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }

  private matchNotResources(resource: string, context?: Context): boolean {
    return this.notResource
      ? !this.notResource.some((a) =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
}

export { ResourceBased };

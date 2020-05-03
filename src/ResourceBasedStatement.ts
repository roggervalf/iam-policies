import {
  PrincipalMap,
  Context,
  ResourceBasedType,
  MatchResourceBasedInterface
} from './types';
import {
  instanceOfPrincipalBlock,
  instanceOfResourceBlock,
  instanceOfNotResourceBlock,
  instanceOfActionBlock
} from './utils/intanceOfInterfaces';
import { Matcher } from './Matcher';
import { Statement, applyContext } from './Statement';

class ResourceBased extends Statement {
  private principal?: PrincipalMap | string[];
  private resource?: string[];
  private action?: string[];
  private notPrincipal?: PrincipalMap | string[];
  private notResource?: string[];
  private notAction?: string[];

  constructor(identity: ResourceBasedType) {
    super(identity);
    if (instanceOfResourceBlock(identity)) {
      this.resource =
        typeof identity.resource === 'string'
          ? [identity.resource]
          : identity.resource;
    } else if (instanceOfNotResourceBlock(identity)) {
      this.notResource =
        typeof identity.notResource === 'string'
          ? [identity.notResource]
          : identity.notResource;
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
    if (instanceOfPrincipalBlock(identity)) {
      this.principal =
        typeof identity.principal === 'string'
          ? [identity.principal]
          : identity.principal;
    } else {
      this.notPrincipal =
        typeof identity.notPrincipal === 'string'
          ? [identity.notPrincipal]
          : identity.notPrincipal;
    }
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
      this.matchPrincipals(principal, principalType, context) &&
      this.matchNotPrincipals(principal, principalType, context) &&
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchResources(resource, context) &&
      this.matchNotResources(resource, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }

  matchPrincipals(
    principal: string,
    principalType?: string,
    context?: Context
  ): boolean {
    if (this.principal) {
      if (this.principal instanceof Array) {
        return principalType
          ? false
          : this.principal.some(a =>
              new Matcher(applyContext(a, context)).match(principal)
            );
      } else {
        if (principalType) {
          const principalValues = this.principal[principalType];
          if (principalValues instanceof Array) {
            return typeof principalValues === 'string'
              ? [principalValues].some(a =>
                  new Matcher(applyContext(a, context)).match(principal)
                )
              : principalValues.some(a =>
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

  matchNotPrincipals(
    principal: string,
    principalType?: string,
    context?: Context
  ): boolean {
    if (this.notPrincipal) {
      if (this.notPrincipal instanceof Array) {
        return principalType
          ? true
          : !this.notPrincipal.some(a =>
              new Matcher(applyContext(a, context)).match(principal)
            );
      } else {
        if (principalType) {
          const principalValues = this.notPrincipal[principalType];
          if (principalValues instanceof Array) {
            return typeof principalValues === 'string'
              ? ![principalValues].some(a =>
                  new Matcher(applyContext(a, context)).match(principal)
                )
              : !principalValues.some(a =>
                  new Matcher(applyContext(a, context)).match(principal)
                );
          }
          return !new Matcher(applyContext(principalValues, context)).match(
            principal
          );
        }
        return false;
      }
    }
    return true;
  }

  matchActions(action: string, context?: Context): boolean {
    return this.action
      ? this.action.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  matchNotActions(action: string, context?: Context): boolean {
    return this.notAction
      ? !this.notAction.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  matchResources(resource: string, context?: Context): boolean {
    return this.resource
      ? this.resource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }

  matchNotResources(resource: string, context?: Context): boolean {
    return this.notResource
      ? !this.notResource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
}

export { ResourceBased };

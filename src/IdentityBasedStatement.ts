import { IdentityBasedType, MatchIdentityBasedInterface } from './types';
import { Matcher } from './Matcher';
import { Statement } from './Statement';
import { applyContext } from './utils/applyContext';

class IdentityBased<T extends object> extends Statement<T> {
  private resource?: string[];
  private action?: string[];
  private notResource?: string[];
  private notAction?: string[];
  private statement: IdentityBasedType;

  constructor(identity: IdentityBasedType) {
    super(identity);
    this.checkAndAssignActions(identity);
    this.checkAndAssignResources(identity);
    this.statement = { ...identity, sid: this.sid };
  }

  getStatement(this: IdentityBased<T>): IdentityBasedType {
    return this.statement;
  }

  matches(
    this: IdentityBased<T>,
    {
      action,
      resource,
      context,
      conditionResolver
    }: MatchIdentityBasedInterface<T>
  ): boolean {
    return (
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchResources(resource, context) &&
      this.matchNotResources(resource, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }

  private checkAndAssignActions(identity: IdentityBasedType): void {
    const hasAction = 'action' in identity;
    const hasNotAction = 'notAction' in identity;
    if (hasAction && hasNotAction) {
      throw new TypeError(
        'IdentityBased statement should have an action or a notAction attribute, no both'
      );
    }
    if ('action' in identity) {
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

  private checkAndAssignResources(identity: IdentityBasedType): void {
    const hasResource = 'resource' in identity;
    const hasNotResource = 'notResource' in identity;
    if (hasResource && hasNotResource) {
      throw new TypeError(
        'IdentityBased statement should have a resource or a notResource attribute, no both'
      );
    }
    if ('resource' in identity) {
      this.resource =
        typeof identity.resource === 'string'
          ? [identity.resource]
          : identity.resource;
    } else {
      this.notResource =
        typeof identity.notResource === 'string'
          ? [identity.notResource]
          : identity.notResource;
    }
  }

  private matchActions(action: string, context?: T): boolean {
    return this.action
      ? this.action.some((a) =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  private matchNotActions(action: string, context?: T): boolean {
    return this.notAction
      ? !this.notAction.some((a) =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  private matchResources(resource: string, context?: T): boolean {
    return this.resource
      ? this.resource.some((a) =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }

  private matchNotResources(resource: string, context?: T): boolean {
    return this.notResource
      ? !this.notResource.some((a) =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
}

export { IdentityBased };

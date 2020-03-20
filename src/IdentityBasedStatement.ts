import {
  Context,
  IdentityBasedType,
  MatchIdentityBasedInterface,
} from './types';
import { instanceOfResourceBlock, instanceOfActionBlock } from './utils';
import { Matcher } from './Matcher';
import { Statement, applyContext } from './Statement';

class IdentityBased extends Statement {
  private resource?: string[];
  private action?: string[];
  private notResource?: string[];
  private notAction?: string[];

  constructor(identity: IdentityBasedType) {
    super(identity);
    if (instanceOfResourceBlock(identity)) {
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

  matches({
    action,
    resource,
    context,
    conditionResolver,
  }: MatchIdentityBasedInterface): boolean {
    return (
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchResources(resource, context) &&
      this.matchNotResources(resource, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }

  private matchActions(action: string, context?: Context): boolean {
    return this.action
      ? this.action.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  private matchNotActions(action: string, context?: Context): boolean {
    return this.notAction
      ? !this.notAction.some(a =>
          new Matcher(applyContext(a, context)).match(action)
        )
      : true;
  }

  private matchResources(resource: string, context?: Context): boolean {
    return this.resource
      ? this.resource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }

  private matchNotResources(resource: string, context?: Context): boolean {
    return this.notResource
      ? !this.notResource.some(a =>
          new Matcher(applyContext(a, context)).match(resource)
        )
      : true;
  }
}

export { IdentityBased };

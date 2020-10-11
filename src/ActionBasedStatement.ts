import { Context, ActionBasedType, MatchActionBasedInterface } from './types';
import { instanceOfActionBlock } from './utils/instanceOfInterfaces';
import { Matcher } from './Matcher';
import { Statement, applyContext } from './Statement';

class ActionBased extends Statement {
  private action?: string[];
  private notAction?: string[];
  private statement: ActionBasedType;

  constructor(action: ActionBasedType) {
    super(action);
    if (instanceOfActionBlock(action)) {
      this.action =
        typeof action.action === 'string' ? [action.action] : action.action;
    } else {
      this.notAction =
        typeof action.notAction === 'string'
          ? [action.notAction]
          : action.notAction;
    }
    this.statement = { ...action, sid: this.sid };
  }

  getStatement(): ActionBasedType {
    return this.statement;
  }

  matches({
    action,
    context,
    conditionResolver
  }: MatchActionBasedInterface): boolean {
    return (
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
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
}

export { ActionBased };

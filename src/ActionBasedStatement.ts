import { ActionBasedType, MatchActionBasedInterface } from './types';
import { Matcher } from './Matcher';
import { Statement } from './Statement';
import { applyContext } from './utils/applyContext';

class ActionBased<T extends object> extends Statement<T> {
  private action?: string[];
  private notAction?: string[];
  private statement: ActionBasedType;

  constructor(action: ActionBasedType) {
    super(action);
    this.checkAndAssignActions(action);
    this.statement = { ...action, sid: this.sid };
  }

  getStatement(this: ActionBased<T>): ActionBasedType {
    return this.statement;
  }

  matches(
    this: ActionBased<T>,
    { action, context, conditionResolver }: MatchActionBasedInterface<T>
  ): boolean {
    return (
      this.matchActions(action, context) &&
      this.matchNotActions(action, context) &&
      this.matchConditions({ context, conditionResolver })
    );
  }

  private checkAndAssignActions(action: ActionBasedType): void {
    const hasAction = 'action' in action;
    const hasNotAction = 'notAction' in action;
    if (hasAction && hasNotAction) {
      throw new TypeError(
        'ActionBased statement should have an action or a notAction attribute, no both'
      );
    }
    if ('action' in action) {
      this.action =
        typeof action.action === 'string' ? [action.action] : action.action;
    } else {
      this.notAction =
        typeof action.notAction === 'string'
          ? [action.notAction]
          : action.notAction;
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
}

export { ActionBased };

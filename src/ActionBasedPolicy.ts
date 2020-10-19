import {
  ActionBasedType,
  ConditionResolver,
  Context,
  EvaluateActionBasedInterface
} from './types';
import { ActionBased } from './ActionBasedStatement';
import { Policy } from './Policy';

interface ActionBasedPolicyInterface {
  statements: ActionBasedType[];
  conditionResolver?: ConditionResolver;
  context?: Context;
}

export class ActionBasedPolicy extends Policy {
  private denyStatements: ActionBased[];
  private allowStatements: ActionBased[];
  private statements: ActionBasedType[];

  constructor({
    statements,
    conditionResolver,
    context
  }: ActionBasedPolicyInterface) {
    super({ context, conditionResolver });
    const statementInstances = statements.map(
      (statement) => new ActionBased(statement)
    );
    this.allowStatements = statementInstances.filter(
      (s) => s.effect === 'allow'
    );
    this.denyStatements = statementInstances.filter((s) => s.effect === 'deny');
    this.statements = statementInstances.map((statement) =>
      statement.getStatement()
    );
  }

  getStatements(): ActionBasedType[] {
    return this.statements;
  }

  evaluate({ action, context }: EvaluateActionBasedInterface): boolean {
    const args = { action, context };
    return !this.cannot(args) && this.can(args);
  }

  can({ action, context }: EvaluateActionBasedInterface): boolean {
    return this.allowStatements.some((s) =>
      s.matches({
        action,
        context: context || this.context,
        conditionResolver: this.conditionResolver
      })
    );
  }

  cannot({ action, context }: EvaluateActionBasedInterface): boolean {
    return this.denyStatements.some((s) =>
      s.matches({
        action,
        context: context || this.context,
        conditionResolver: this.conditionResolver
      })
    );
  }
}

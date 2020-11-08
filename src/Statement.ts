import {
  EffectBlock,
  ConditionBlock,
  StatementInterface,
  MatchConditionInterface
} from './types';
import { getValueFromPath } from './utils/getValueFromPath';
import { generateUUID } from './utils/generateUUID';

abstract class Statement {
  protected sid: string;
  protected readonly condition?: ConditionBlock;
  effect: EffectBlock;

  constructor({ sid, effect = 'allow', condition }: StatementInterface) {
    if (!sid) {
      this.sid = generateUUID();
    } else {
      this.sid = sid;
    }
    this.effect = effect;
    this.condition = condition;
  }

  matchConditions(
    this: Statement,
    { context, conditionResolver }: MatchConditionInterface
  ): boolean {
    const { condition: conditions } = this;
    return conditionResolver && conditions && context
      ? Object.keys(conditions).every((condition) =>
          Object.keys(conditions[condition]).every((path) => {
            const conditionValues = conditions[condition][path];
            if (conditionValues instanceof Array) {
              return conditionValues.some((value) =>
                conditionResolver[condition](
                  getValueFromPath(context, path),
                  value
                )
              );
            }
            return conditionResolver[condition](
              getValueFromPath(context, path),
              conditionValues
            );
          })
        )
      : true;
  }
}

export { Statement };

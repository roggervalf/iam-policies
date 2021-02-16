import {
  EffectBlock,
  ConditionBlock,
  StatementInterface,
  MatchConditionInterface,
  MatchConditionResolverInterface
} from './types';
import { getValueFromPath } from './utils/getValueFromPath';
import { generateUUID } from './utils/generateUUID';
import {operators} from './conditionOperators';

abstract class Statement<T extends object> {
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
    this: Statement<T>,
    { context, conditionResolver }: MatchConditionInterface<T>
  ): boolean {
    const { condition: conditions } = this;

    if(conditions && context){
      return Object.keys(conditions).every((condition) =>
        Object.keys(conditions[condition]).every((path) => {
          const conditionValues = conditions[condition][path];
          if (conditionValues instanceof Array) {
            return conditionValues.some((value) =>
              this.evaluateCondition({
                context,
                conditionResolver,
                condition,
                path,
                value
              })
            );
          }

          return this.evaluateCondition({
            context,
            conditionResolver,
            condition,
            path,
            value: conditionValues
          });
        })
      )
    }

    return true;
  }

  private evaluateCondition(
    this: Statement<T>,
    { context, conditionResolver={}, path, value, condition }: MatchConditionResolverInterface<T>
  ): boolean {

    const currentResolver= conditionResolver[condition] || operators[condition]

    if(currentResolver){
      return currentResolver(
        getValueFromPath(context, path),
        value
      )
    }
    return false;
  }
}

export { Statement };

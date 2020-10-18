import {
  EffectBlock,
  ConditionBlock,
  StatementInterface,
  Context,
  MatchConditionInterface
} from './types';
import { getValueFromPath } from './utils/getValueFromPath';
import { generateUUID } from './utils/generateUUID';

const reDelimiters = /\${([^}]*)}/g;
const trim = / +(?= )|^\s+|\s+$/g;

const specialTrim = (str: string): string => str.replace(trim, '');

export function applyContext(str: string, context?: Context): string {
  if (!context) return str;

  return specialTrim(
    str.replace(reDelimiters, (_, path: string) => {
      const value = getValueFromPath(context, path);
      if (Array.isArray(value)) return `{${value}}`;
      if (value instanceof Object) return 'undefined';

      return String(value);
    })
  );
}

class Statement {
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

  matchConditions({
    context,
    conditionResolver
  }: MatchConditionInterface): boolean {
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

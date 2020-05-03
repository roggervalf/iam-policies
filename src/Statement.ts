import {
  EffectBlock,
  ConditionBlock,
  StatementInterface,
  // ConditionKey,
  Context,
  MatchConditionInterface
} from './types';
import { getValueFromPath } from './utils/getValueFromPath';

const reDelimiters = /\${([^}])*}/g;
const trim = / +(?= )|^\s+|\s+$/g;

const specialTrim = (str: string): string => str.replace(trim, '');

export function applyContext(str: string, context?: Context): string {
  if (!context) return str;

  return specialTrim(
    str.replace(reDelimiters, match => {
      const path = match.substr(2, match.length - 3);
      let value = getValueFromPath(context, path);
      if (Array.isArray(value)) value = `{${value}}`;
      if (value instanceof Object) value = undefined;

      return match ? String(value) : '';
    })
  );
}

class Statement {
  effect: EffectBlock;
  protected readonly condition?: ConditionBlock;

  constructor({ effect = 'allow', condition }: StatementInterface) {
    this.effect = effect;
    this.condition = condition;
  }

  matchConditions({
    context,
    conditionResolver
  }: MatchConditionInterface): boolean {
    return conditionResolver && this.condition && context
      ? Object.keys(this.condition).every(condition =>
          Object.keys(this.condition ? this.condition[condition] : {}).every(
            path => {
              if (this.condition) {
                const conditionValues = this.condition[condition][path];
                if (conditionValues instanceof Array) {
                  return conditionValues.some(value =>
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
              }
              return conditionResolver[condition](
                getValueFromPath(context, path),
                ''
              );
            }
          )
        )
      : true;
  }
}

export { Statement };

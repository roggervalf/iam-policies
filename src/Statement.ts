import {
  EffectBlock,
  ConditionBlock,
  StatementInterface,
  Context,
  MatchConditionInterface
} from './types'

const reDelimiters = /\${([^}])*}/g;
const trim = / +(?= )|^\s+|\s+$/g;

export function getValueFromPath(data: any, path: string): string {
  let value=data;
  path.split('.').forEach((step) => {
    if(value)
      value=value[step];
  });
  
  if (Array.isArray(value)) return `{${value}}`;
  if (value instanceof Object) return 'undefined';

  return `${value}`;
}

const specialTrim = (str: string): string => str.replace(trim, '');

export function applyContext(str: string, context?: Context): string {
  if (!context) return str;

  return specialTrim(
    str.replace(reDelimiters, match => {
      const path = match.substr(2, match.length - 3);

      return match ? String(getValueFromPath(context, path)) : '';
    })
  );
}

class Statement {
  effect: EffectBlock;
  protected readonly condition?: ConditionBlock;

  constructor({
    effect = 'allow',
    condition,
  }: StatementInterface) {
    this.effect = effect;
    this.condition = condition;
  }

  matchConditions({
    context,
    conditionResolver
  }:MatchConditionInterface): boolean {
    return (
      (conditionResolver && this.condition && context
        ? Object.keys(this.condition).every(condition =>
            Object.keys(
              this.condition ? this.condition[condition] : {}
            ).every(path =>{
              if(this.condition){
                const conditionValues=this.condition[condition][path]
                if(conditionValues instanceof Array){
                  return conditionValues.some(value=>conditionResolver[condition](
                    getValueFromPath(context, path),
                    value
                  ))
                }
                return conditionResolver[condition](
                  getValueFromPath(context, path),
                  conditionValues
                )
              }
              return conditionResolver[condition](
                getValueFromPath(context, path),
                ''
              )
            }
              
            )
          )
        : true)
    );
  }
}

export { Statement };

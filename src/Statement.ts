import { Minimatch } from 'minimatch';

const reDelimiters = /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|\$\{([^\\}]*(?:\\.[^\\}]*)*)\}|<%([\s\S]+?)%>|$/g;
const trim = / +(?= )|^\s+|\s+$/g

type StatementEffect = 'allow' | 'deny'
type StatementPattern = string

interface Condition {
  [key: string]: any
}

interface StatementConditions {
  [key: string]: Condition
}

export type StatementConfig = {
  effect?: StatementEffect
  resource: StatementPattern[] | StatementPattern
  action: StatementPattern[] | StatementPattern
  condition?: StatementConditions
}

type Resolver = (data: any, expected: any) => boolean;

export interface ConditionResolver {
  [key: string]: Resolver
}
//"Condition" : { "{condition-operator}" : { "{condition-key}" : "{condition-value}" }}
export class Statement {
  effect: StatementEffect
  private resource: StatementPattern[]
  private action: StatementPattern[]
  private condition?: StatementConditions
  constructor({ effect = 'allow', resource, action, condition }: StatementConfig) {
    this.effect = effect
    this.resource = typeof resource === "string"? [resource]:resource
    this.action = typeof action === "string"? [action]:action
    this.condition = condition
  }

  matches(action: string, resource: string, context?: object, conditionResolvers?: ConditionResolver): boolean {
    return (
      this.action.some(a =>
        new Minimatch(applyContext(a, context)).match(action)
      ) &&
      this.resource.some(r =>
        new Minimatch(applyContext(r, context)).match(resource)
      ) && ((conditionResolvers&&this.condition&&context)?Object.keys(this.condition).every(condition =>
        Object.keys(this.condition?this.condition[condition]:{}).every(path=>
          conditionResolvers[condition](getValueFromPath(context,path),this.condition?this.condition[condition][path]:"")
        )  
      ):true)
    )
  }
}

export function getValueFromPath(data:any, path:string):any {
  let value= data
  const steps = path.split('.');
  steps.forEach(step => {
    if(value){
      value=value[step]
    }});
  return value
}

const specialTrim = (str:string):string => str.replace(trim, "");

export function applyContext(str: string, context?: object):string {
  if (!context) return str
  return specialTrim(str.replace(
    reDelimiters,
    (
      match,
      escapeValue,
      interpolateValue,
      esTemplateValue,
      evaluateValue,
      offset
    ) => {
      let path = interpolateValue || esTemplateValue;  
      return match ? String(getValueFromPath(context, path)) : "";
    }
  ))
}

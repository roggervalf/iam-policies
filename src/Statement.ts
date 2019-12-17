import { Minimatch } from 'minimatch'
import template from 'lodash.template'

type StatementEffect = 'allow' | 'deny'
type StatementPattern = string

interface Condition {
  [key: string]: any
}

interface StatementConditions {
  [key: string]: Condition
}

interface ConditionResolver {
  [key: string]: any
}

export type StatementConfig = {
  effect?: StatementEffect
  resource: StatementPattern[] | StatementPattern
  action: StatementPattern[] | StatementPattern
  condition?: StatementConditions
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
    if(conditionResolvers&&this.condition&&context){
      return (
        this.action.some(a =>
          new Minimatch(applyContext(a, context)).match(action)
        ) &&
        this.resource.some(r =>
          new Minimatch(applyContext(r, context)).match(resource)
        ) &&
        Object.keys(this.condition).every(condition =>
          Object.keys(this.condition?this.condition[condition]:{}).every(path=>
            conditionResolvers[condition](getValueFromPath(context,path),this.condition?this.condition[condition][path]:"")
          )  
        )
      )
  }
    return (
      this.action.some(a =>
        new Minimatch(applyContext(a, context)).match(action)
      ) &&
      this.resource.some(r =>
        new Minimatch(applyContext(r, context)).match(resource)
      )
    )
  }
}

export function getValueFromPath(data:any, path:string) {
  let value= data
  const steps = path.split('.');
  steps.forEach(e => value=value[e]);
  return value
}

export function applyContext(str: string, context?: object) {
  if (context == null) return str
  const t = template(str)
  return t(context)
}

import { Minimatch } from 'minimatch'
import template from 'lodash.template'

type StatementEffect = 'allow' | 'deny'
type StatementPattern = string
export type StatementConfig = {
  effect?: StatementEffect
  resources: StatementPattern[]
  actions: StatementPattern[]
}

export class Statement {
  effect: StatementEffect
  private resources: StatementPattern[]
  private actions: StatementPattern[]
  constructor({ effect = 'allow', resources, actions }: StatementConfig) {
    this.effect = effect
    this.resources = resources
    this.actions = actions
  }
  matches(action: string, resource: string, context?: object): boolean {
    return (
      this.actions.some(a =>
        new Minimatch(applyContext(a, context)).match(action)
      ) &&
      this.resources.some(r =>
        new Minimatch(applyContext(r, context)).match(resource)
      )
    )
  }
}

export function applyContext(str: string, context?: object) {
  if (context == null) return str
  const t = template(str)
  return t(context)
}

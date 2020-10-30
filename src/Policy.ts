import { MatchConditionInterface, ConditionResolver, Context } from './types';

class Policy {
  protected context?: Context;
  protected conditionResolver?: ConditionResolver;

  constructor({ context, conditionResolver }: MatchConditionInterface) {
    this.context = context;
    this.conditionResolver = conditionResolver;
  }

  setContext(this: Policy, context: Context): void {
    this.context = context;
  }

  getContext(this: Policy): Context | undefined {
    return this.context;
  }

  setConditionResolver(
    this: Policy,
    conditionResolver: ConditionResolver
  ): void {
    this.conditionResolver = conditionResolver;
  }

  getConditionResolver(this: Policy): ConditionResolver | undefined {
    return this.conditionResolver;
  }
}

export { Policy };

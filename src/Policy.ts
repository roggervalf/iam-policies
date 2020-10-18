import { MatchConditionInterface, ConditionResolver, Context } from './types';

class Policy {
  protected context: Context;
  protected conditionResolver: ConditionResolver;

  constructor({ context, conditionResolver }: MatchConditionInterface) {
    this.context = context;
    this.conditionResolver = conditionResolver;
  }

  setContext(context: Context): void {
    this.context = context;
  }

  getContext(): Context {
    return this.context;
  }

  setConditionResolver(conditionResolver: ConditionResolver): void {
    this.conditionResolver = conditionResolver;
  }

  getConditionResolver(): ConditionResolver {
    return this.conditionResolver;
  }
}

export { Policy };

import { MatchConditionInterface, ConditionResolver } from './types';

class Policy<T extends object> {
  protected context?: T;
  protected conditionResolver?: ConditionResolver;

  constructor({ context, conditionResolver }: MatchConditionInterface<T>) {
    this.context = context;
    this.conditionResolver = conditionResolver;
  }

  setContext(this: Policy<T>, context: T): void {
    this.context = context;
  }

  getContext(this: Policy<T>): T | undefined {
    return this.context;
  }

  setConditionResolver(
    this: Policy<T>,
    conditionResolver: ConditionResolver
  ): void {
    this.conditionResolver = conditionResolver;
  }

  getConditionResolver(this: Policy<T>): ConditionResolver | undefined {
    return this.conditionResolver;
  }
}

export { Policy };

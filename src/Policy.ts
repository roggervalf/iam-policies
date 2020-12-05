import { MatchConditionInterface, ConditionResolver } from './types';

abstract class Policy<T extends object, U> {
  protected context?: T;
  protected conditionResolver?: ConditionResolver;

  constructor({ context, conditionResolver }: MatchConditionInterface<T>) {
    this.context = context;
    this.conditionResolver = conditionResolver;
  }

  setContext(this: Policy<T, U>, context: T): void {
    this.context = context;
  }

  getContext(this: Policy<T, U>): T | undefined {
    return this.context;
  }

  setConditionResolver(
    this: Policy<T, U>,
    conditionResolver: ConditionResolver
  ): void {
    this.conditionResolver = conditionResolver;
  }

  getConditionResolver(this: Policy<T, U>): ConditionResolver | undefined {
    return this.conditionResolver;
  }

  abstract getStatements(this: Policy<T, U>): U[];
}

export { Policy };

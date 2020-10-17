import { PolicyInterface, Context } from './types';

class Policy {
  protected context: Context;

  constructor({ context }: PolicyInterface) {
    if (context) {
      this.context = context;
    }
  }

  setContext(context: Context): void {
    this.context = context;
  }

  getContext(): Context {
    return this.context;
  }
}

export { Policy };

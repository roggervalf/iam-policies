import { Policy } from './Policy';

describe('Policy Class', () => {
  it('returns a Policy instance', () => {
    expect(new Policy({})).toBeInstanceOf(Policy);
    expect(new Policy({ context: { user: { age: 31 } } })).toBeInstanceOf(
      Policy
    );
  });

  describe('when getContext', () => {
    it('returns context attribute', () => {
      const context = { user: { age: 31 } };
      expect(new Policy({ context }).getContext()).toBe(context);
    });
  });

  describe('when setContext', () => {
    it('sets context attribute', () => {
      const context = { user: { age: 31 } };
      const policy = new Policy({});
      policy.setContext(context);
      expect(policy.getContext()).toBe(context);
    });
  });
});

import { ActionBased } from './ActionBasedStatement';

describe('ActionBased Class', () => {
  describe('when creating action based statement', () => {
    it("doesn't throw an error", () => {
      expect(
        () =>
          new ActionBased({
            action: ['read', 'write']
          })
      ).not.toThrow();
      expect(
        () =>
          new ActionBased({
            notAction: ['write']
          })
      ).not.toThrow();
    });

    it('throws a TypeError', () => {
      const expectedError = new TypeError(
        'ActionBased statement should have an action or a notAction attribute, no both'
      );
      expect(() => {
        new ActionBased({
          action: ['read', 'write'],
          notAction: 'delete'
        });
      }).toThrow(expectedError);
    });
  });
});

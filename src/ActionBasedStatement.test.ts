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

    describe('when creating action based statement with no actions', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'ActionBased statement should have an action or a notAction attribute'
        );

        expect(() => {
          new ActionBased({});
        }).toThrow(expectedError);
      });
    });

    describe('when creating action based statement with action and notAction attributes', () => {
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
});

import { IdentityBased } from './IdentityBasedStatement';

describe('IdentityBased Class', () => {
  describe('when creating identity based statement', () => {
    it("doesn't throw an error", () => {
      expect(
        () =>
          new IdentityBased({
            action: ['read', 'write'],
            resource: 'secret'
          })
      ).not.toThrow();
      expect(
        () =>
          new IdentityBased({
            notAction: ['write'],
            notResource: ['secret']
          })
      ).not.toThrow();
    });

    describe('when creating identity based statement with action and notAction attributes', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'IdentityBased statement should have an action or a notAction attribute, no both'
        );

        expect(() => {
          new IdentityBased({
            action: ['read', 'write'],
            notAction: 'delete',
            resource: 'books'
          });
        }).toThrow(expectedError);
      });
    });

    describe('when creating identity based statement with resource and notResource attributes', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'IdentityBased statement should have a resource or a notResource attribute, no both'
        );

        expect(() => {
          new IdentityBased({
            action: ['read', 'write'],
            resource: ['secret'],
            notResource: 'topSecret'
          });
        }).toThrow(expectedError);
      });
    });
  });
});

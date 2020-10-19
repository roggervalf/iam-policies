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

    describe('when creating identity based statement with no actions', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'IdentityBased statement should have an action or a notAction attribute'
        );

        expect(() => {
          new IdentityBased({
            resource: 'secret'
          });
        }).toThrow(expectedError);
      });
    });

    describe('when creating identity based statement with no resources', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'IdentityBased statement should have a resource or a notResource attribute'
        );

        expect(() => {
          new IdentityBased({
            action: 'write'
          });
        }).toThrow(expectedError);
      });
    });

    describe('when creating identity based statement with action and notAction attributes', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'IdentityBased statement should have an action or a notAction attribute, no both'
        );

        expect(() => {
          new IdentityBased({
            action: ['read', 'write'],
            notAction: 'delete'
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

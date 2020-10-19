import { ResourceBased } from './ResourceBasedStatement';

describe('ResourceBased Class', () => {
  describe('when creating resource based statement', () => {
    it("doesn't throw an error", () => {
      expect(
        () =>
          new ResourceBased({
            action: ['read', 'write'],
            resource: 'secret'
          })
      ).not.toThrow();
      expect(
        () =>
          new ResourceBased({
            notAction: ['write'],
            notResource: ['secret']
          })
      ).not.toThrow();
    });

    describe('when creating resource based statement with no actions', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'ResourceBased statement should have an action or a notAction attribute'
        );
        expect(() => {
          new ResourceBased({
            resource: 'secret'
          });
        }).toThrow(expectedError);
      });
    });

    describe('when creating resource based statement with action and notAction attributes', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'ResourceBased statement should have an action or a notAction attribute, no both'
        );
        expect(() => {
          new ResourceBased({
            action: ['read', 'write'],
            notAction: 'delete'
          });
        }).toThrow(expectedError);
      });
    });

    describe('when creating resource based statement with resource and notResource attributes', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'ResourceBased statement could have a resource or a notResource attribute, no both'
        );
        expect(() => {
          new ResourceBased({
            action: ['read', 'write'],
            resource: ['account'],
            notResource: 'profile'
          });
        }).toThrow(expectedError);
      });
    });

    describe('when creating resource based statement with principal and notPrincipal attributes', () => {
      it('throws a TypeError', () => {
        const expectedError = new TypeError(
          'ResourceBased statement could have a principal or a notPrincipal attribute, no both'
        );
        expect(() => {
          new ResourceBased({
            action: ['read', 'write'],
            principal: ['id1'],
            notPrincipal: 'id2'
          });
        }).toThrow(expectedError);
      });
    });
  });
});

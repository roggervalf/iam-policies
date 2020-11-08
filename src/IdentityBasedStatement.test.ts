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

    describe('when match conditions', () => {
      it('returns true', () => {
        const firstIdentityBasedStatement = new IdentityBased({
          sid: 'first',
          action: ['write'],
          resource: 'topSecret',
          condition: {
            greaterThan: { 'user.age': 30 }
          }
        });
        const secondIdentityBasedStatement = new IdentityBased({
          sid: 'second',
          action: ['write'],
          resource: 'topSecret',
          condition: {
            lessThan: { 'user.age': [30, 40] }
          }
        });
        const conditionResolver = {
          greaterThan: (data: number, expected: number): boolean => {
            return data > expected;
          },
          lessThan: (data: number, expected: number): boolean => {
            return data < expected;
          }
        };

        expect(
          firstIdentityBasedStatement.matches({
            action: 'write',
            resource: 'topSecret',
            context: { user: { age: 31 } },
            conditionResolver
          })
        ).toBe(true);
        expect(
          secondIdentityBasedStatement.matches({
            action: 'write',
            resource: 'topSecret',
            context: { user: { age: 35 } },
            conditionResolver
          })
        ).toBe(true);
      });

      it('returns false', () => {
        const firstIdentityBasedStatement = new IdentityBased({
          sid: 'first',
          action: ['write'],
          resource: 'topSecret',
          condition: {
            greaterThan: { 'user.age': 35 }
          }
        });
        const secondIdentityBasedStatement = new IdentityBased({
          sid: 'second',
          action: ['write'],
          resource: 'topSecret',
          condition: {
            lessThan: { 'user.age': [50, 45] }
          }
        });
        const conditionResolver = {
          greaterThan: (data: number, expected: number): boolean => {
            return data > expected;
          },
          lessThan: (data: number, expected: number): boolean => {
            return data < expected;
          }
        };

        expect(
          firstIdentityBasedStatement.matches({
            action: 'write',
            resource: 'topSecret',
            context: { user: { age: 31 } },
            conditionResolver
          })
        ).toBe(false);
        expect(
          secondIdentityBasedStatement.matches({
            action: 'write',
            resource: 'topSecret',
            context: { user: { age: 60 } },
            conditionResolver
          })
        ).toBe(false);
      });
    });
  });
});

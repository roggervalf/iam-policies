import { getValueFromPath, applyContext, Statement } from '../src/Statement';
export default (): void => {
  describe('Statement Class', () => {
    describe('getValueFromPath function', () => {
      it('get value from existed path', () => {
        const context = {
          user: { id: 456, bestfriends: [123, 532] }
        };
        expect(getValueFromPath(context, 'user.bestfriends')).toEqual([
          123,
          532
        ]);
        expect(getValueFromPath(context, 'user.id')).toBe(456);
        expect(getValueFromPath(context, 'user')).toEqual({
          id: 456,
          bestfriends: [123, 532]
        });
      });

      it('get undefined from non existed path', () => {
        const context = {
          user: { id: 456, bestfriends: [123] }
        };
        expect(getValueFromPath(context, 'user.id.pets')).toBe(undefined);
        expect(getValueFromPath(context, 'company')).toBe(undefined);
      });
    });

    describe('applyContext function', () => {
      it('can match based on context', () => {
        const context = {
          user: { id: 456, bestfriends: [123, 532, 987] }
        };
        expect(applyContext('secrets:${user.id}:*', context)).toBe(
          'secrets:456:*'
        );

        expect(applyContext('secrets:${user.bestfriends}:*', context)).toBe(
          'secrets:{123,532,987}:*'
        );

        expect(
          applyContext('secrets:${user.bestfriends}:account', context)
        ).toBe('secrets:{123,532,987}:account');
      });

      it('can match undefined path', () => {
        const context = {
          user: { id: 456, bestfriends: [123, 987] }
        };

        expect(applyContext('secrets:${}:account', context)).toBe(
          'secrets:undefined:account'
        );
      });
    });

    it('returns a Statement instance', () => {
      expect(new Statement({})).toBeInstanceOf(Statement);
      expect(new Statement({ effect: 'deny' })).toBeInstanceOf(Statement);
      expect(
        new Statement({ condition: { greatherThan: { 'user.age': 30 } } })
      ).toBeInstanceOf(Statement);
    });

    describe('when match conditions', () => {
      it('returns true', () => {
        const firstStatementConfig = {
          condition: {
            greatherThan: { 'user.age': 30 }
          }
        };
        const secondStatementConfig = {
          condition: {
            lessThan: { 'user.age': [30, 40] }
          }
        };
        const conditionResolver = {
          greatherThan: (data: number, expected: number): boolean => {
            return data > expected;
          },
          lessThan: (data: number, expected: number): boolean => {
            return data < expected;
          }
        };
        expect(
          new Statement(firstStatementConfig).matchConditions({
            context: { user: { age: 31 } },
            conditionResolver
          })
        ).toBe(true);
        expect(
          new Statement(secondStatementConfig).matchConditions({
            context: { user: { age: 35 } },
            conditionResolver
          })
        ).toBe(true);
      });

      it('returns false', () => {
        const firstStatementConfig = {
          condition: {
            greatherThan: { 'user.age': 35 }
          }
        };
        const secondStatementConfig = {
          condition: {
            lessThan: { 'user.age': [50, 45] }
          }
        };
        const conditionResolver = {
          greatherThan: (data: number, expected: number): boolean => {
            return data > expected;
          },
          lessThan: (data: number, expected: number): boolean => {
            return data < expected;
          }
        };
        expect(
          new Statement(firstStatementConfig).matchConditions({
            context: { user: { age: 31 } },
            conditionResolver
          })
        ).toBe(false);
        expect(
          new Statement(secondStatementConfig).matchConditions({
            context: { user: { age: 60 } },
            conditionResolver
          })
        ).toBe(false);
      });
    });
  });
};

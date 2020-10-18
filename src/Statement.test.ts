import { applyContext, Statement } from './Statement';

describe('Statement Class', () => {
  describe('applyContext function', () => {
    it('can match based on context', () => {
      const context = {
        user: { id: 456, bestFriends: [123, 532, 987] }
      };
      expect(applyContext('secrets:${user.id}:*', context)).toBe(
        'secrets:456:*'
      );

      expect(applyContext('secrets:${user.bestFriends}:*', context)).toBe(
        'secrets:{123,532,987}:*'
      );

      expect(applyContext('secrets:${user.bestFriends}:account', context)).toBe(
        'secrets:{123,532,987}:account'
      );

      expect(
        applyContext(
          'secrets:${user.id}:bestFriends:${user.bestFriends}',
          context
        )
      ).toBe('secrets:456:bestFriends:{123,532,987}');
    });

    it('can match non-existed path', () => {
      const context = {
        user: { id: 456, bestFriends: [123, 987] }
      };

      expect(applyContext('secrets:${}:account', context)).toBe(
        'secrets:undefined:account'
      );
      expect(applyContext('secrets:${company.address}:account', context)).toBe(
        'secrets:undefined:account'
      );
    });

    it('can match object values', () => {
      const context = {
        user: { id: 456, address: { lat: 11, long: 52 } }
      };

      expect(applyContext('secrets:${user.address}:account', context)).toBe(
        'secrets:undefined:account'
      );
    });
  });

  it('returns a Statement instance', () => {
    expect(new Statement({})).toBeInstanceOf(Statement);
    expect(new Statement({ effect: 'deny' })).toBeInstanceOf(Statement);
    expect(
      new Statement({ condition: { greaterThan: { 'user.age': 30 } } })
    ).toBeInstanceOf(Statement);
  });

  describe('when match conditions', () => {
    it('returns true', () => {
      const firstStatementConfig = {
        sid: 'first',
        condition: {
          greaterThan: { 'user.age': 30 }
        }
      };
      const secondStatementConfig = {
        condition: {
          lessThan: { 'user.age': [30, 40] }
        }
      };
      const conditionResolver = {
        greaterThan: (data: number, expected: number): boolean => {
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
          greaterThan: { 'user.age': 35 }
        }
      };
      const secondStatementConfig = {
        condition: {
          lessThan: { 'user.age': [50, 45] }
        }
      };
      const conditionResolver = {
        greaterThan: (data: number, expected: number): boolean => {
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

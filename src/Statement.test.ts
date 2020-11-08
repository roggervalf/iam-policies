import { Statement } from './Statement';

describe('Statement Class', () => {
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

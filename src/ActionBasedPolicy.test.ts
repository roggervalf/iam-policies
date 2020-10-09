import { ActionBasedPolicy } from './ActionBasedPolicy';

describe('ActionBasedPolicy Class', () => {
  describe('when creating action based policy', () => {
    it("doesn't throw an error", () => {
      expect(
        () =>
          new ActionBasedPolicy([
            {
              action: ['read', 'write']
            }
          ])
      ).not.toThrow();
    });

    it('returns an ActionBasedPolicy instance', () => {
      expect(
        new ActionBasedPolicy([
          {
            action: ['read', 'write']
          }
        ])
      ).toBeInstanceOf(ActionBasedPolicy);
    });
  });

  describe('when get statements', () => {
    it('returns those statements', () => {
      const statements = [
        {
          action: ['read']
        }
      ];
      const policy = new ActionBasedPolicy(statements);
      expect(policy.getStatements()).toEqual(statements);
    });
  });

  describe('when match actions', () => {
    it('returns true or false', () => {
      const policy = new ActionBasedPolicy([
        {
          action: ['read']
        }
      ]);

      expect(
        policy.evaluate({
          action: 'read'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'write'
        })
      ).toBe(false);
    });
  });

  describe('when match not actions', () => {
    it('returns true or false', () => {
      const policy = new ActionBasedPolicy([
        {
          notAction: 'read'
        }
      ]);

      expect(
        policy.evaluate({
          action: 'read'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'write'
        })
      ).toBe(true);
    });
  });

  describe('when match based on context', () => {
    it('returns true or false', () => {
      const policy = new ActionBasedPolicy([
        {
          action: ['getUser/${user.id}', 'updateUser/${user.id}']
        },
        {
          action: 'getAllProjects'
        }
      ]);

      expect(
        policy.evaluate({
          action: 'getUser/123',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'updateUser/124',
          context: { user: { id: 124 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'getUser/123',
          context: { user: { id: 456 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'updateUser/124',
          context: {
            user: { id: 456 }
          }
        })
      ).toBe(false);
      expect(policy.evaluate({ action: 'createProject' })).toBe(false);
    });
  });

  describe('when match based on conditions', () => {
    it('returns true or false', () => {
      const conditions = {
        greaterThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };

      const policy = new ActionBasedPolicy(
        [
          {
            action: ['read']
          },
          {
            action: ['write', 'update'],
            condition: {
              greaterThan: {
                'user.age': 18
              }
            }
          }
        ],
        conditions
      );

      expect(
        policy.evaluate({
          action: 'read',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'write',
          context: { user: { id: 123, age: 17 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'write',
          context: { user: { id: 456, age: 19 } }
        })
      ).toBe(true);
    });
  });

  describe('can and cannot', () => {
    it('can should return false when not found and true for when matched with allow', () => {
      const policy = new ActionBasedPolicy([
        {
          effect: 'allow',
          action: [
            'createProject',
            'getUser/${user.id}',
            'updateUser/${user.id}'
          ]
        }
      ]);
      expect(
        policy.can({
          action: 'getUser/123',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.can({
          action: 'createProject'
        })
      ).toBe(true);
      expect(
        policy.can({
          action: 'updateUser/124',
          context: { user: { id: 123 } }
        })
      ).toBe(false);
    });

    it('cannot should return false when not found and true for when matched with deny', () => {
      const policy = new ActionBasedPolicy([
        {
          effect: 'deny',
          action: [
            'createProject',
            'getUser/${user.id}',
            'updateUser/${user.id}'
          ]
        }
      ]);
      expect(
        policy.cannot({
          action: 'getUser/123',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.cannot({
          action: 'createProject'
        })
      ).toBe(true);
      expect(
        policy.cannot({
          action: 'updateUser/124',
          context: { user: { id: 123 } }
        })
      ).toBe(false);
    });
  });
});

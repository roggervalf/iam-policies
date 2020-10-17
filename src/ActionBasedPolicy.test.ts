import { ActionBasedPolicy } from './ActionBasedPolicy';

describe('ActionBasedPolicy Class', () => {
  describe('when creating action based policy', () => {
    it("doesn't throw an error", () => {
      expect(
        () =>
          new ActionBasedPolicy({
            statements: [
              {
                action: ['read', 'write']
              }
            ]
          })
      ).not.toThrow();
      expect(
        () =>
          new ActionBasedPolicy({
            statements: [
              {
                notAction: ['write']
              }
            ],
            context: {}
          })
      ).not.toThrow();
    });

    it('returns an ActionBasedPolicy instance', () => {
      expect(
        new ActionBasedPolicy({
          statements: [
            {
              action: ['read', 'write']
            }
          ]
        })
      ).toBeInstanceOf(ActionBasedPolicy);
    });
  });

  describe('when get statements', () => {
    it('returns those statements', () => {
      const statements = [
        {
          action: 'read'
        }
      ];
      const policy = new ActionBasedPolicy({ statements });
      const exportedStatements = policy.getStatements();
      expect(exportedStatements).toMatchObject(statements);
      expect(exportedStatements[0].sid).not.toBeFalsy();
    });
  });

  describe('when match actions', () => {
    it('returns true or false', () => {
      const policy = new ActionBasedPolicy({
        statements: [
          {
            action: ['read']
          }
        ]
      });

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
      const policy = new ActionBasedPolicy({
        statements: [
          {
            notAction: 'read'
          }
        ]
      });

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
      const policy = new ActionBasedPolicy({
        statements: [
          {
            action: ['getUser/${user.id}', 'updateUser/${user.id}']
          },
          {
            action: 'getAllProjects'
          }
        ],
        context: { user: { id: 123 } }
      });

      expect(
        policy.evaluate({
          action: 'getUser/123'
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
      const conditionResolver = {
        greaterThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };

      const policy = new ActionBasedPolicy({
        statements: [
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
        conditionResolver
      });

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
      const policy = new ActionBasedPolicy({
        statements: [
          {
            effect: 'allow',
            action: [
              'createProject',
              'getUser/${user.id}',
              'updateUser/${user.id}'
            ]
          }
        ]
      });
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
      const policy = new ActionBasedPolicy({
        statements: [
          {
            effect: 'deny',
            action: [
              'createProject',
              'getUser/${user.id}',
              'updateUser/${user.id}'
            ]
          }
        ]
      });
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

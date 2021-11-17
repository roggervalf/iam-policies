import { IdentityBasedPolicy } from './IdentityBasedPolicy';

describe('IdentityBasedPolicy Class', () => {
  describe('when creating identity based policy', () => {
    it("doesn't throw an error", () => {
      expect(
        () =>
          new IdentityBasedPolicy({
            statements: [
              {
                resource: 'some:glob:*:string/word',
                action: ['read', 'write']
              }
            ]
          })
      ).not.toThrow();
    });

    it('returns an IdentityBasedPolicy instance', () => {
      expect(
        new IdentityBasedPolicy({
          statements: [
            {
              notResource: ['some:glob:*:string/word'],
              notAction: ['read', 'write']
            }
          ]
        })
      ).toBeInstanceOf(IdentityBasedPolicy);
    });
  });

  describe('when addStatement is called', () => {
    describe('when adding an statement with effect as allow', () => {
      it('adds a new IdentityBased statement', () => {
        const statements = [
          {
            resource: ['books:horror:*'],
            action: ['read']
          }
        ];
        const newStatement = {
          effect: 'allow' as const,
          resource: ['books:horror:*'],
          action: 'write'
        };

        const policy = new IdentityBasedPolicy({ statements });
        policy.addStatement(newStatement);
        const exportedStatements = policy.getStatements();

        expect(exportedStatements).toMatchObject([...statements, newStatement]);
      });
    });

    describe('when adding an statement with effect as deny', () => {
      it('adds a new IdentityBased statement', () => {
        const statements = [
          {
            resource: ['books:horror:*'],
            action: ['read']
          }
        ];
        const newStatement = {
          effect: 'deny' as const,
          resource: ['books:horror:*'],
          action: 'write'
        };

        const policy = new IdentityBasedPolicy({ statements });
        policy.addStatement(newStatement);
        const exportedStatements = policy.getStatements();

        expect(exportedStatements).toMatchObject([...statements, newStatement]);
      });
    });
  });

  describe('when getStatements is called', () => {
    it('returns those statements', () => {
      const statements = [
        {
          resource: ['books:horror:*'],
          action: ['read']
        }
      ];
      const policy = new IdentityBasedPolicy({ statements });
      const exportedStatements = policy.getStatements();

      expect(exportedStatements).toMatchObject(statements);
      expect(exportedStatements[0].sid).not.toBeFalsy();
    });
  });

  describe('when getContext is called', () => {
    it('returns context attribute', () => {
      const context = { user: { age: 31 } };
      const statements = [
        {
          resource: ['books:horror:*'],
          action: ['read']
        }
      ];
      const policy = new IdentityBasedPolicy({ statements, context });

      expect(policy.getContext()).toBe(context);
    });
  });

  describe('when setContext is called', () => {
    it('sets context attribute', () => {
      const context = { user: { age: 31 } };
      const statements = [
        {
          resource: ['books:horror:*'],
          action: ['read']
        }
      ];
      const policy = new IdentityBasedPolicy({ statements });
      policy.setContext(context);

      expect(policy.getContext()).toBe(context);
    });
  });

  describe('when match actions', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            resource: ['books:horror:*'],
            action: ['read']
          }
        ]
      });

      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'write',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
    });
  });

  describe('when match not actions', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            resource: 'books:horror:*',
            notAction: 'read'
          }
        ]
      });

      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'write',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
    });
  });

  describe('when match resources', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            resource: 'books:horror:*',
            action: 'read'
          }
        ]
      });

      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:fantasy:Jumanji'
        })
      ).toBe(false);
    });
  });

  describe('when match not resources', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            notResource: 'books:horror:*',
            action: 'read'
          }
        ]
      });

      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:fantasy:Brisingr'
        })
      ).toBe(true);
    });
  });

  describe('when match based on context', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy<Record<string, any>>({
        statements: [
          {
            resource: ['secrets:${user.id}:*'],
            action: ['read', 'write']
          },
          {
            effect: 'deny',
            resource: ['secrets:${user.bestFriends}:*'],
            action: 'read'
          }
        ],
        context: { user: { id: 124 } }
      });

      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:124:code'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:123:code'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:123:code',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'write',
          resource: 'secrets:123:code',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:123:secret',
          context: { user: { id: 456 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:563:secret',
          context: {
            user: { id: 563, bestFriends: [123, 1211] }
          }
        })
      ).toBe(true);
      expect(
        policy.evaluate({ action: 'write', resource: 'secrets:123:secret' })
      ).toBe(false);
    });
  });

  describe('when match based on custom conditions', () => {
    it('returns true or false', () => {
      const conditionResolver = {
        greaterThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            resource: 'secrets:*',
            action: ['read', 'write']
          },
          {
            resource: ['posts:${user.id}:*'],
            action: ['write', 'read', 'update'],
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
          resource: 'secrets:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'write',
          resource: 'posts:123:sshhh',
          context: { user: { id: 123, age: 17 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'posts:456:sshhh',
          context: { user: { id: 456, age: 19 } }
        })
      ).toBe(true);
    });
  });

  describe('when match based on default conditions', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            resource: 'secrets:*',
            action: ['read', 'write']
          },
          {
            resource: ['posts:*'],
            action: ['write', 'read', 'update'],
            condition: {
              stringLikeIfExists: {
                'user.id': '12'
              }
            }
          }
        ]
      });

      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:123:ultra',
          context: { user: {} }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'write',
          resource: 'posts:ultra',
          context: { user: { id: '123', age: 17 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'posts:ultra',
          context: { user: { age: 19 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'posts:ultra',
          context: { user: { id: '12', age: 19 } }
        })
      ).toBe(true);
    });
  });

  describe('can and cannot', () => {
    it('can should return false when not found and true for when matched with allow', () => {
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            effect: 'allow',
            resource: ['posts:${user.id}:*'],
            action: ['write', 'read', 'update']
          },
          {
            effect: 'allow',
            resource: ['projects:${user.id}:*'],
            action: ['write', 'read']
          }
        ]
      });

      expect(
        policy.can({
          action: 'read',
          resource: 'posts:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.whyCan({
          action: 'read',
          resource: 'posts:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toMatchObject([
        {
          effect: 'allow',
          resource: ['posts:${user.id}:*'],
          action: ['write', 'read', 'update']
        }
      ]);
      expect(
        policy.can({
          action: 'read',
          resource: 'posts:000:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(false);
    });

    it('cannot should return false when not found and true for when matched with deny', () => {
      const policy = new IdentityBasedPolicy({
        statements: [
          {
            effect: 'deny',
            resource: ['posts:${user.id}:*'],
            action: ['write', 'read', 'update']
          },
          {
            effect: 'deny',
            resource: ['projects:${user.id}:*'],
            action: ['write', 'read']
          }
        ]
      });

      expect(
        policy.cannot({
          action: 'read',
          resource: 'posts:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.whyCannot({
          action: 'read',
          resource: 'posts:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toMatchObject([
        {
          effect: 'deny',
          resource: ['posts:${user.id}:*'],
          action: ['write', 'read', 'update']
        }
      ]);
      expect(
        policy.cannot({
          action: 'read',
          resource: 'posts:000:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(false);
    });
  });
});

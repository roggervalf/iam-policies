import { ResourceBasedPolicy } from './ResourceBasedPolicy';

describe('ResourceBasedPolicy Class', () => {
  describe('when creating resource based policy', () => {
    it("doesn't throw an error", () => {
      expect(
        () =>
          new ResourceBasedPolicy({
            statements: [
              {
                principal: 'rogger',
                resource: 'some:glob:*:string/example',
                action: ['read', 'write']
              }
            ]
          })
      ).not.toThrow();
    });

    it('returns a ResourceBasedPolicy instance', () => {
      expect(
        new ResourceBasedPolicy({
          statements: [
            {
              notPrincipal: 'rogger',
              notResource: 'some:glob:*:string/example',
              notAction: ['read', 'write']
            }
          ]
        })
      ).toBeInstanceOf(ResourceBasedPolicy);
    });
  });

  describe('when get statements', () => {
    it('returns those statements', () => {
      const statements = [
        {
          principal: 'andre',
          resource: ['books:horror:*'],
          action: ['read']
        }
      ];
      const policy = new ResourceBasedPolicy({ statements });
      const exportedStatements = policy.getStatements();
      expect(exportedStatements).toMatchObject(statements);
      expect(exportedStatements[0].sid).not.toBeFalsy();
    });
  });

  describe('when getConditionResolver', () => {
    it('returns conditionResolver attribute', () => {
      const conditionResolver = {
        greaterThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };
      const statements = [
        {
          principal: 'andre',
          resource: ['books:horror:*'],
          action: ['read']
        }
      ];
      const policy = new ResourceBasedPolicy({ statements, conditionResolver });

      expect(policy.getConditionResolver()).toBe(conditionResolver);
    });
  });

  describe('when setConditionResolver', () => {
    it('sets conditionResolver attribute', () => {
      const conditionResolver = {
        greaterThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };
      const statements = [
        {
          principal: 'andre',
          resource: ['books:horror:*'],
          action: ['read']
        }
      ];
      const policy = new ResourceBasedPolicy({ statements });
      policy.setConditionResolver(conditionResolver);

      expect(policy.getConditionResolver()).toBe(conditionResolver);
    });
  });

  describe('when match principal', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            principal: 'andre',
            resource: 'books:horror:*',
            action: ['read']
          },
          {
            principal: { id: '1' },
            resource: ['books:horror:*'],
            action: 'write'
          },
          {
            resource: ['books:science:*'],
            action: 'read'
          }
        ]
      });

      expect(
        policy.evaluate({
          principal: 'andre',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: '1',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: '1',
          action: 'write',
          resource: 'books:horror:The Call of Cthulhu',
          principalType: 'id'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: '1',
          action: 'write',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:science:Chemistry'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'id1',
          action: 'read',
          resource: 'books:science:Chemistry'
        })
      ).toBe(false);
    });
  });

  describe('when match not principal', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            notPrincipal: { id: 'andre' },
            resource: 'books:horror:*',
            action: ['read']
          },
          {
            notPrincipal: { id: ['rogger'] },
            resource: 'secrets:admin:*',
            action: 'read'
          }
        ]
      });

      expect(
        policy.evaluate({
          principal: 'andre',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'secrets:admin:friends',
          principalType: 'id'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: 'andre',
          action: 'read',
          resource: 'secrets:admin:friends',
          principalType: 'id'
        })
      ).toBe(true);
    });
  });

  describe('when match actions', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            principal: { id: ['123'] },
            resource: ['books:horror:*'],
            action: ['read']
          },
          {
            notPrincipal: ['124'],
            resource: ['books:science:*'],
            action: ['write']
          }
        ]
      });

      expect(
        policy.evaluate({
          principal: '123',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu',
          principalType: 'id'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: '123',
          action: 'write',
          resource: 'books:horror:The Call of Cthulhu',
          principalType: 'id'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: '125',
          action: 'write',
          resource: 'books:science:Chemistry'
        })
      ).toBe(true);
    });
  });

  describe('when match not actions', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            principal: { id: '123' },
            resource: ['books:horror:*'],
            notAction: 'get*'
          }
        ]
      });

      expect(
        policy.evaluate({
          principal: '123',
          action: 'getAuthor',
          resource: 'books:horror:The Call of Cthulhu',
          principalType: 'id'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: '123',
          action: 'write',
          resource: 'books:horror:The Call of Cthulhu',
          principalType: 'id'
        })
      ).toBe(true);
    });
  });

  describe('when match resources', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            principal: ['rogger', 'andre'],
            resource: 'books:horror:*',
            action: ['read']
          },
          {
            principal: 'andre',
            action: ['write']
          }
        ]
      });

      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'andre',
          action: 'read'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: 'andre',
          action: 'write'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'andre',
          resource: 'books',
          action: 'write'
        })
      ).toBe(false);
    });
  });

  describe('when match not resources', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            principal: ['rogger', 'andre'],
            notResource: ['books:horror:*'],
            action: ['read']
          }
        ]
      });

      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: 'andre',
          action: 'read',
          resource: 'books:fantasy:Brisingr'
        })
      ).toBe(true);
    });
  });

  describe('when match based on context', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            principal: { id: 'rogger' },
            resource: ['secrets:${user.id}:*'],
            action: ['read', 'write']
          },
          {
            principal: { id: 'rogger' },
            resource: ['secrets:${user.bestFriends}:*'],
            action: 'read'
          }
        ]
      });

      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'secrets:123:code',
          principalType: 'id',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'write',
          resource: 'secrets:123:code',
          principalType: 'id',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'secrets:123:sshhh',
          principalType: 'id',
          context: { user: { id: 456 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'secrets:563:sshhh',
          principalType: 'id',
          context: {
            user: { id: 456, bestFriends: [123, 563, 1211] }
          }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'write',
          resource: 'secrets:123:sshhh'
        })
      ).toBe(false);
    });
  });

  describe('when match based on conditions', () => {
    it('returns true or false', () => {
      const conditionResolver = {
        greaterThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };

      const policy = new ResourceBasedPolicy({
        statements: [
          {
            principal: { id: 'rogger' },
            resource: 'secrets:*',
            action: ['read', 'write']
          },
          {
            principal: { id: 'rogger' },
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
          principal: 'rogger',
          action: 'read',
          resource: 'secrets:123:sshhh',
          principalType: 'id',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'write',
          resource: 'posts:123:sshhh',
          principalType: 'id',
          context: { user: { id: 123, age: 17 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          principal: 'rogger',
          action: 'read',
          resource: 'posts:456:sshhh',
          principalType: 'id',
          context: { user: { id: 456, age: 19 } }
        })
      ).toBe(true);
    });
  });

  describe('can and cannot', () => {
    it('can should return false when not found and true for when matched with allow', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            effect: 'allow',
            principal: { id: 'rogger' },
            resource: ['posts:${user.id}:*'],
            action: ['write', 'read', 'update']
          }
        ]
      });

      expect(
        policy.can({
          principal: 'rogger',
          action: 'read',
          resource: 'posts:123:sshhh',
          principalType: 'id',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.can({
          principal: 'rogger',
          action: 'read',
          resource: 'posts:000:sshhh',
          principalType: 'id',
          context: { user: { id: 123 } }
        })
      ).toBe(false);
    });

    it('cannot should return false when not found and true for when matched with deny', () => {
      const policy = new ResourceBasedPolicy({
        statements: [
          {
            effect: 'deny',
            principal: { id: 'rogger' },
            resource: ['posts:${user.id}:*'],
            action: ['write', 'read', 'update']
          }
        ]
      });

      expect(
        policy.cannot({
          principal: 'rogger',
          action: 'read',
          resource: 'posts:123:sshhh',
          principalType: 'id',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.cannot({
          principal: 'rogger',
          action: 'read',
          resource: 'posts:000:sshhh',
          principalType: 'id',
          context: { user: { id: 123 } }
        })
      ).toBe(false);
    });
  });
});

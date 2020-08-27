import { ResourceBasedPolicy } from './ResourceBasedPolicy';

describe('ResourceBasedPolicy Class', () => {
  describe('when creating resource based policy', () => {
    it("don't throw an error", () => {
      expect(
        () =>
          new ResourceBasedPolicy([
            {
              principal: 'rogger',
              resource: 'some:glob:*:string/example',
              action: ['read', 'write']
            }
          ])
      ).not.toThrow();
    });

    it('returns a ResourceBasedPolicy instance', () => {
      expect(
        new ResourceBasedPolicy([
          {
            notPrincipal: 'rogger',
            resource: 'some:glob:*:string/example',
            action: ['read', 'write']
          }
        ])
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
      const policy = new ResourceBasedPolicy(statements);
      expect(policy.getStatements()).toEqual(statements);
    });
  });

  describe('when match principal', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy([
        {
          principal: 'andre',
          resource: 'books:horror:*',
          action: ['read']
        },
        {
          principal: { id: '1' },
          resource: ['books:horror:*'],
          action: 'write'
        }
      ]);

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
    });
  });

  describe('when match not principal', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy([
        {
          notPrincipal: 'andre',
          resource: 'books:horror:*',
          action: ['read']
        },
        {
          notPrincipal: { id: 'rogger' },
          resource: 'secrets:admin:*',
          action: 'read'
        }
      ]);

      expect(
        policy.evaluate({
          principal: 'andre',
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(false);
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
      const policy = new ResourceBasedPolicy([
        {
          principal: { id: '123' },
          resource: ['books:horror:*'],
          action: ['read']
        }
      ]);

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
    });
  });

  describe('when match not actions', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy([
        {
          principal: { id: '123' },
          resource: ['books:horror:*'],
          notAction: 'get*'
        }
      ]);

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
      const policy = new ResourceBasedPolicy([
        {
          principal: ['rogger', 'andre'],
          resource: 'books:horror:*',
          action: ['read']
        }
      ]);

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
          action: 'read',
          resource: 'books:fantasy:Brisingr'
        })
      ).toBe(false);
    });
  });

  describe('when match not resources', () => {
    it('returns true or false', () => {
      const policy = new ResourceBasedPolicy([
        {
          principal: ['rogger', 'andre'],
          notResource: 'books:horror:*',
          action: ['read']
        }
      ]);

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
      const policy = new ResourceBasedPolicy([
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
      ]);

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
      const conditions = {
        greaterThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };

      const policy = new ResourceBasedPolicy(
        [
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
        conditions
      );

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
      const policy = new ResourceBasedPolicy([
        {
          effect: 'allow',
          principal: { id: 'rogger' },
          resource: ['posts:${user.id}:*'],
          action: ['write', 'read', 'update']
        }
      ]);
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
      const policy = new ResourceBasedPolicy([
        {
          effect: 'deny',
          principal: { id: 'rogger' },
          resource: ['posts:${user.id}:*'],
          action: ['write', 'read', 'update']
        }
      ]);
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

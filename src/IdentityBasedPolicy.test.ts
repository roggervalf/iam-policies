import { IdentityBasedPolicy } from './Policies';

describe('IdentityBasedPolicy Class', () => {
  describe('when creating identity based policy', () => {
    it("don't throw an error", () => {
      expect(
        () =>
          new IdentityBasedPolicy([
            {
              resource: 'some:glob:*:string/wqweqw',
              action: ['read', 'write']
            }
          ])
      ).not.toThrow();
    });

    it('returns an IdentityBasedPolicy instance', () => {
      expect(
        new IdentityBasedPolicy([
          {
            resource: 'some:glob:*:string/wqweqw',
            action: ['read', 'write']
          }
        ])
      ).toBeInstanceOf(IdentityBasedPolicy);
    });
  });

  describe('when match actions', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy([
        {
          resource: ['books:horror:*'],
          action: ['read']
        }
      ]);

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
      const policy = new IdentityBasedPolicy([
        {
          resource: 'books:horror:*',
          notAction: 'read'
        }
      ]);

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
      const policy = new IdentityBasedPolicy([
        {
          resource: 'books:horror:*',
          action: 'read'
        }
      ]);

      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:horror:The Call of Cthulhu'
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'books:fantasy:Brisingr'
        })
      ).toBe(false);
    });
  });

  describe('when match not resources', () => {
    it('returns true or false', () => {
      const policy = new IdentityBasedPolicy([
        {
          notResource: 'books:horror:*',
          action: 'read'
        }
      ]);

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
      const policy = new IdentityBasedPolicy([
        {
          resource: ['secrets:${user.id}:*'],
          action: ['read', 'write']
        },
        {
          resource: ['secrets:${user.bestfriends}:*'],
          action: 'read'
        }
      ]);

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
          resource: 'secrets:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:123:sshhh',
          context: { user: { id: 456 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'read',
          resource: 'secrets:563:sshhh',
          context: {
            user: { id: 456, bestfriends: [123, 563, 1211] }
          }
        })
      ).toBe(true);
      expect(
        policy.evaluate({ action: 'write', resource: 'secrets:123:sshhh' })
      ).toBe(false);
    });
  });

  describe('when match based on conditions', () => {
    it('returns true or false', () => {
      const conditions = {
        greatherThan: (data: number, expected: number): boolean => {
          return data > expected;
        }
      };

      const policy = new IdentityBasedPolicy(
        [
          {
            resource: 'secrets:*',
            action: ['read', 'write']
          },
          {
            resource: ['posts:${user.id}:*'],
            action: ['write', 'read', 'update'],
            condition: {
              greatherThan: {
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
  describe('can and cannot', () => {
    it('can should return false when not found and true for when matched with allow', () => {
      const policy = new IdentityBasedPolicy([
        {
          effect: 'allow',
          resource: ['posts:${user.id}:*'],
          action: ['write', 'read', 'update']
        }
      ]);
      expect(
        policy.can({
          action: 'read',
          resource: 'posts:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
      expect(
        policy.can({
          action: 'read',
          resource: 'posts:000:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(false);
    });

    it('cannot should return false when not found and true for when matched with deny', () => {
      const policy = new IdentityBasedPolicy([
        {
          effect: 'deny',
          resource: ['posts:${user.id}:*'],
          action: ['write', 'read', 'update']
        }
      ]);
      expect(
        policy.cannot({
          action: 'read',
          resource: 'posts:123:sshhh',
          context: { user: { id: 123 } }
        })
      ).toBe(true);
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

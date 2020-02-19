import { ResourceBasedPolicy } from '../src/Role';
export default (): void => {
  describe('ResourceBasedPolicy Class', () => {
    describe('can create role', () => {
      it('don\'t throw an error', () => {
        expect(
          () =>
            new ResourceBasedPolicy([
              {
                resource: 'some:glob:*:string/wqweqw',
                action: ['read', 'write'],
              },
            ])
        ).not.toThrow();
      });
    });

    describe('can match some actions and not others', () => {
      it('returns true or false', () => {
        const role = new ResourceBasedPolicy([
          {
            principal: 'rogger',
            resource: ['books:horror:*'],
            action: ['read'],
          },
        ]);
        expect(role.can('rogger','read', 'books:horror:The Call of Cthulhu')).toBe(true);
        expect(role.can('andre','write', 'books:horror:The Call of Cthulhu')).toBe(false);
      });
    });

    describe('can match some resources and not others', () => {
      it('returns true or false', () => {
        const role = new ResourceBasedPolicy([
          {
            principal: 'rogger',
            resource: ['books:horror:*'],
            action: ['read'],
          },
        ]);
        expect(role.can('rogger','read', 'books:horror:The Call of Cthulhu')).toBe(true);
        expect(role.can('rogger','read', 'books:fantasy:Brisingr')).toBe(false);
      });
    });

    describe('can match based on context', () => {
      it('returns true or false', () => {
        const role = new ResourceBasedPolicy([
          {
            principal:{id: 'rogger'},
            resource: ['secrets:${user.id}:*'],
            action: ['read', 'write'],
          },
          {
            principal:{id: 'rogger'},
            resource: ['secrets:${user.bestfriends}:*'],
            action: 'read',
          },
        ]);
        expect(role.can('rogger','read', 'secrets:123:sshhh','id', { user: { id: 123 } })).toBe(
          true
        );
        expect(
          role.can('rogger','write', 'secrets:123:sshhh','id', { user: { id: 123 } })
        ).toBe(true);
        expect(role.can('rogger','read', 'secrets:123:sshhh','id', { user: { id: 456 } })).toBe(
          false
        );
        expect(
          role.can('rogger','read', 'secrets:563:sshhh','id', {
            user: { id: 456, bestfriends: [123, 563, 1211] },
          })
        ).toBe(true);
        expect(role.can('rogger','write', 'secrets:123:sshhh')).toBe(false);
      });
    });

    describe('can match based on conditions', () => {
      it('returns true or false', () => {
        const conditions = {
          greatherThan: (data: number, expected: number): boolean => {
            return data > expected;
          },
        };
  
        const role = new ResourceBasedPolicy(
          [
            {
              principal:{id: 'rogger'},
              resource: 'secrets:*',
              action: ['read', 'write'],
            },
            {
              principal:{id: 'rogger'},
              resource: ['posts:${user.id}:*'],
              action: ['write', 'read', 'update'],
              condition: {
                greatherThan: {
                  'user.age': 18,
                },
              },
            },
          ],
          conditions
        );
  
        expect(role.can('rogger','read', 'secrets:123:sshhh','id', { user: { id: 123 } })).toBe(
          true
        );
        expect(
          role.can('rogger','write', 'posts:123:sshhh', 'id',{ user: { id: 123, age: 17 } })
        ).toBe(false);
        expect(
          role.can('rogger','read', 'posts:456:sshhh', 'id',{ user: { id: 456, age: 19 } })
        ).toBe(true);
      });
    });
  });
};

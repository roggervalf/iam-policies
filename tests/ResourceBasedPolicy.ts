import { ResourceBasedPolicy } from '../src/Policies';
export default (): void => {
  describe('ResourceBasedPolicy Class', () => {
    describe('when creating resource based policy', () => {
      it('don\'t throw an error', () => {
        expect(
          () =>
            new ResourceBasedPolicy([
              {
                principal: 'rogger',
                resource: 'some:glob:*:string/wqweqw',
                action: ['read', 'write'],
              },
            ])
        ).not.toThrow();
      });

      it('returns a ResourceBasedPolicy instance', () => {
        expect(new ResourceBasedPolicy([
          {
            notPrincipal: 'rogger',
            resource: 'some:glob:*:string/wqweqw',
            action: ['read', 'write'],
          },
        ])).toBeInstanceOf(
          ResourceBasedPolicy
        );
      });
    });

    describe('when match principal', () => {
      it('returns true or false', () => {
        const policy = new ResourceBasedPolicy([
          {
            principal: 'andre',
            resource: 'books:horror:*',
            action: ['read'],
          },
          {
            principal: {id: '1'},
            resource: ['books:horror:*'],
            action: 'write',
          },
        ]);
        
        expect(policy.can({principal: 'andre', action: 'read', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(true);
        expect(policy.can({principal: 'rogger', action: 'read', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(false);
        expect(policy.can({principal: '1', action: 'read', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(false);
        expect(policy.can({principal: '1', action: 'write', resource: 'books:horror:The Call of Cthulhu', principalType: 'id'}))
          .toBe(true);
        expect(policy.can({principal: '1', action: 'write', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(false);
      });
    });

    describe('when match not principal', () => {
      it('returns true or false', () => {
        const policy = new ResourceBasedPolicy([
          {
            notPrincipal: 'andre',
            resource: 'books:horror:*',
            action: ['read'],
          },
        ]);

        expect(policy.can({principal: 'andre', action: 'read', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(false);
        expect(policy.can({principal: 'rogger', action: 'read', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(true);
      });
    });

    describe('when match actions', () => {
      it('returns true or false', () => {
        const policy = new ResourceBasedPolicy([
          {
            principal: {id: '123'},
            resource: ['books:horror:*'],
            action: ['read'],
          },
        ]);

        expect(policy.can({principal: '123', action: 'read', resource: 'books:horror:The Call of Cthulhu', principalType: 'id'}))
          .toBe(true);
        expect(policy.can({principal: '123', action: 'write', resource: 'books:horror:The Call of Cthulhu', principalType: 'id'}))
          .toBe(false);
      });
    });

    describe('when match not actions', () => {
      it('returns true or false', () => {
        const policy = new ResourceBasedPolicy([
          {
            principal: {id: '123'},
            resource: ['books:horror:*'],
            notAction: 'get*',
          },
        ]);

        expect(policy.can({principal: '123', action: 'getAuthor', resource: 'books:horror:The Call of Cthulhu', principalType: 'id'}))
          .toBe(false);
        expect(policy.can({principal: '123', action: 'write', resource: 'books:horror:The Call of Cthulhu', principalType: 'id'}))
          .toBe(true);
      });
    });

    describe('when match resources', () => {
      it('returns true or false', () => {
        const policy = new ResourceBasedPolicy([
          {
            principal: ['rogger', 'andre'],
            resource: 'books:horror:*',
            action: ['read'],
          },
        ]);

        expect(policy.can({principal:'rogger', action: 'read', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(true);
        expect(policy.can({principal: 'andre', action: 'read', resource: 'books:fantasy:Brisingr'}))
          .toBe(false);
      });
    });

    describe('when match not resources', () => {
      it('returns true or false', () => {
        const policy = new ResourceBasedPolicy([
          {
            principal: ['rogger', 'andre'],
            notResource: 'books:horror:*',
            action: ['read'],
          },
        ]);

        expect(policy.can({principal:'rogger', action: 'read', resource: 'books:horror:The Call of Cthulhu'}))
          .toBe(false);
        expect(policy.can({principal: 'andre', action: 'read', resource: 'books:fantasy:Brisingr'}))
          .toBe(true);
      });
    });

    describe('when match based on context', () => {
      it('returns true or false', () => {
        const policy = new ResourceBasedPolicy([
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

        expect(policy.can({principal: 'rogger', action: 'read', resource: 'secrets:123:sshhh', principalType: 'id', context: { user: { id: 123 } }}))
          .toBe(true);
        expect(policy.can({principal: 'rogger', action: 'write', resource: 'secrets:123:sshhh', principalType: 'id', context: { user: { id: 123 } }}))
          .toBe(true);
        expect(policy.can({principal: 'rogger', action: 'read', resource: 'secrets:123:sshhh', principalType: 'id', context: { user: { id: 456 } }}))
          .toBe(false);
        expect(policy.can({principal: 'rogger', action: 'read', resource: 'secrets:563:sshhh', principalType: 'id', context: {
            user: { id: 456, bestfriends: [123, 563, 1211] },
          }}))
          .toBe(true);
        expect(policy.can({principal: 'rogger', action: 'write', resource: 'secrets:123:sshhh'}))
          .toBe(false);
      });
    });

    describe('when match based on conditions', () => {
      it('returns true or false', () => {
        const conditions = {
          greatherThan: (data: number, expected: number): boolean => {
            return data > expected;
          },
        };
  
        const policy = new ResourceBasedPolicy(
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
  
        expect(policy.can({principal: 'rogger', action: 'read', resource: 'secrets:123:sshhh', principalType: 'id', context: { user: { id: 123 } }}))
          .toBe(true);
        expect(policy.can({principal: 'rogger', action: 'write', resource: 'posts:123:sshhh', principalType: 'id', context: { user: { id: 123, age: 17 } }}))
          .toBe(false);
        expect(policy.can({principal: 'rogger', action: 'read', resource: 'posts:456:sshhh', principalType: 'id', context: { user: { id: 456, age: 19 } }}))
          .toBe(true);
      });
    });
  });
};

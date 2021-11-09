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

  describe('when addStatement is called', () => {
    describe('when adding an statement with effect as allow', () => {
      it('adds a new ActionBased statement', () => {
        const statements = [
          {
            action: 'read'
          }
        ];
        const newStatement = {
          action: 'write'
        };

        const policy = new ActionBasedPolicy({ statements });
        policy.addStatement(newStatement);
        const exportedStatements = policy.getStatements();

        expect(exportedStatements).toMatchObject([...statements, newStatement]);
      });
    });

    describe('when adding an statement with effect as deny', () => {
      it('adds a new ActionBased statement', () => {
        const statements = [
          {
            action: 'read'
          }
        ];
        const newStatement = {
          effect: 'deny' as const,
          action: 'write'
        };

        const policy = new ActionBasedPolicy({ statements });
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
      class User {
        constructor(public info = { id: 456, age: 19 }) {}
        get user() {
          return this.info;
        }
      }

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
          context: new User()
        })
      ).toBe(true);
    });
  });

  describe('when condition does not exist', () => {
    it('returns false', () => {
      class User {
        constructor(public info = { id: 456, age: 19 }) {}
        get user() {
          return this.info;
        }
      }

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
        ]
      });

      expect(
        policy.evaluate({
          action: 'write',
          context: { user: { id: 123, age: 17 } }
        })
      ).toBe(false);
      expect(
        policy.evaluate({
          action: 'write',
          context: new User()
        })
      ).toBe(false);
    });
  });

  describe('when condition is predefined', () => {
    it('returns true or false', () => {
      class User {
        constructor(public info = { name: 'Juan', age: 19 }) {}
        get user() {
          return this.info;
        }
      }

      const policy = new ActionBasedPolicy({
        statements: [
          {
            action: ['read']
          },
          {
            action: ['write', 'update'],
            condition: {
              stringEquals: {
                'user.name': 'Joan'
              }
            }
          }
        ]
      });

      expect(
        policy.evaluate({
          action: 'write',
          context: { user: { name: 'Joan', age: 17 } }
        })
      ).toBe(true);
      expect(
        policy.evaluate({
          action: 'write',
          context: new User()
        })
      ).toBe(false);
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
          },
          {
            effect: 'allow',
            action: ['createAccount']
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
        policy.whyCan({
          action: 'getUser/123',
          context: { user: { id: 123 } }
        })
      ).toMatchObject([
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
          },
          {
            effect: 'deny',
            action: ['createAccount']
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
        policy.whyCannot({
          action: 'getUser/123',
          context: { user: { id: 123 } }
        })
      ).toMatchObject([
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

  describe('generate Proxy', () => {
    describe('when use default options', () => {
      it('returns an instance of a class', () => {
        const policy = new ActionBasedPolicy({
          statements: [
            {
              action: ['upper', 'lastName', 'age']
            }
          ]
        });
        class User {
          firstName: string;
          age: number;
          private lastName: string;
          constructor(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
          }
          upper(): string {
            return this.lastName.toUpperCase();
          }
        }
        const user = new User('John', 'Wick');
        const proxy = policy.generateProxy(user);
        const getExpectedError = new Error(
          'Unauthorize to get firstName property'
        );
        const setExpectedError = new Error(
          'Unauthorize to set firstName property'
        );

        expect(proxy.upper()).toBe('WICK');
        expect(proxy.upper()).toBe('WICK');
        expect(() => {
          proxy.age = 20;
        }).not.toThrow();
        expect(proxy.age).toBe(20);
        expect(() => (proxy.firstName = 'Nancy')).toThrow(setExpectedError);
        expect(() => proxy.firstName).toThrow(getExpectedError);
      });

      it('returns a json', () => {
        const policy = new ActionBasedPolicy({
          statements: [
            {
              action: ['lastName']
            }
          ]
        });
        const sym: string = Symbol('id') as unknown as string;
        const user = {
          firstName: 'John',
          lastName: 'Wick',
          [sym]: 1
        };
        const proxy = policy.generateProxy(user);
        const expectedError = new Error(
          'Unauthorize to get firstName property'
        );
        const expectedError2 = new Error(
          "'set' on proxy: trap returned falsish for property 'Symbol(id)'"
        );
        const expectedError3 = new Error(
          'Unauthorize to get otherValue property'
        );

        expect(proxy.lastName).toBe('Wick');
        expect(() => proxy.firstName).toThrow(expectedError);
        expect(() => (proxy[sym] = 2)).toThrow(expectedError2);
        expect(proxy[sym]).toBe(1);
        expect(() => proxy.otherValue).toThrow(expectedError3);
      });
    });

    describe('when pass options', () => {
      it('sets propertyMap', () => {
        const policy = new ActionBasedPolicy({
          statements: [
            {
              action: ['getLastName']
            }
          ]
        });
        const user = {
          firstName: 'John',
          lastName: 'Wick'
        };
        const proxy = policy.generateProxy(user, {
          get: {
            propertyMap: {
              lastName: 'getLastName'
            }
          },
          set: {
            allow: false
          }
        });
        const expectedError = new Error(
          'Unauthorize to get firstName property'
        );

        expect(proxy.lastName).toBe('Wick');
        expect(() => proxy.firstName).toThrow(expectedError);
      });

      it('sets propertyMap', () => {
        const policy = new ActionBasedPolicy({
          statements: [
            {
              action: ['setLastName']
            }
          ]
        });
        const user = {
          firstName: 'John',
          lastName: 'Wick'
        };
        const proxy = policy.generateProxy(user, {
          set: {
            propertyMap: {
              lastName: 'setLastName'
            }
          },
          get: {
            allow: false
          }
        });
        const expectedError = new Error(
          'Unauthorize to set firstName property'
        );

        expect(() => (proxy.lastName = 'Smith')).not.toThrow();
        expect(proxy.lastName).toBe('Smith');
        expect(() => (proxy.firstName = 'Mario')).toThrow(expectedError);
      });
    });
  });
});

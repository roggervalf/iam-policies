import { getValueFromPath } from './getValueFromPath';

describe('getValueFromPath', () => {
  describe('when object is null', () => {
    describe('when non default param is passed', () => {
      it('should return undefined', () => {
        expect(getValueFromPath(null, 'user.bestFriends')).toEqual(undefined);
      });
    });

    describe('when default param is passed', () => {
      it("should get 'default'", () => {
        expect(getValueFromPath(null, 'user.id.pets', 'default')).toBe(
          'default'
        );
      });
    });
  });

  describe('when object is class instance', () => {
    describe('when path exist', () => {
      it('should get value from existed string path', () => {
        class User {
          bestFriends?: number[];
          age?: number;
          firstName: string;
          private lastName: string;
          constructor(firstName, lastName, bestFriends?, age?) {
            this.age = age;
            this.bestFriends = bestFriends;
            this.firstName = firstName;
            this.lastName = lastName;
          }
          get upperLastName(): string {
            return this.lastName.toUpperCase();
          }
        }
        const context = new User('John', 'Wick', [123, 532]);

        expect(getValueFromPath(context, 'bestFriends')).toEqual([123, 532]);
        expect(getValueFromPath(context, 'firstName')).toBe('John');
        expect(getValueFromPath(context, 'upperLastName')).toEqual('WICK');
      });
    });

    describe('when path does not exist', () => {
      describe('when non default param is passed', () => {
        it('should get undefined', () => {
          class User {
            firstName: string;
            constructor(firstName) {
              this.firstName = firstName;
            }
          }
          const context = new User('John');

          expect(getValueFromPath(context, 'user.id.pets')).toBe(undefined);
          expect(getValueFromPath(context, 'company')).toBe(undefined);
          expect(getValueFromPath(context, 'company.address')).toBe(undefined);
        });
      });
    });
  });

  describe('when object is a json object', () => {
    describe('when path exist', () => {
      it('should get value from existed string path', () => {
        const context = {
          user: { id: 456, bestFriends: [123, 532], '56': 50 }
        };

        expect(getValueFromPath(context, 'user.bestFriends')).toEqual([
          123,
          532
        ]);
        expect(getValueFromPath(context, 'user.id')).toBe(456);
        expect(getValueFromPath(context, 'user')).toEqual({
          id: 456,
          bestFriends: [123, 532],
          '56': 50
        });
        expect(getValueFromPath(context, 'user.56')).toEqual(50);
      });

      it('should get value from existed array path', () => {
        const context = {
          user: { id: 456, bestFriends: [123, 532], '56': 50 }
        };

        expect(getValueFromPath(context, ['user', 'bestFriends'])).toEqual([
          123,
          532
        ]);
        expect(getValueFromPath(context, ['user', 'id'])).toBe(456);
        expect(getValueFromPath(context, ['user'])).toEqual({
          id: 456,
          bestFriends: [123, 532],
          '56': 50
        });
        expect(getValueFromPath(context, ['user', 56])).toEqual(50);
      });
    });

    describe('when path does not exist', () => {
      describe('when non default param is passed', () => {
        it('should get undefined', () => {
          const context = {
            user: { id: 456, bestFriends: [123] }
          };

          expect(getValueFromPath(context, 'user.id.pets')).toBe(undefined);
          expect(getValueFromPath(context, 'company')).toBe(undefined);
          expect(getValueFromPath(context, 'company.address')).toBe(undefined);
        });
      });

      describe('when default param is passed', () => {
        it("should get 'default'", () => {
          const context = {
            user: { id: 456, bestFriends: [123] }
          };

          expect(getValueFromPath(context, 'user.id.pets', 'default')).toBe(
            'default'
          );
          expect(getValueFromPath(context, 'company', 'default')).toBe(
            'default'
          );
        });
      });
    });

    describe('when path reference an array value', () => {
      it('should resolve array path', () => {
        const context = { a: [{ b: { c: 3 }, d: [{ e: 4 }, 2] }] };

        expect(getValueFromPath(context, 'a[0].b.c')).toBe(3);
        expect(getValueFromPath(context, 'a[0].d[1]')).toBe(2);
        expect(getValueFromPath(context, 'a[0].d[0].e')).toBe(4);
      });
    });
  });
});

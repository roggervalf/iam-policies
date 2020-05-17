import { getValueFromPath } from './getValueFromPath';

describe('getValueFromPath', () => {
  describe('when path exist', () => {
    it('should get value from existed string path', () => {
      const context = {
        user: { id: 456, bestFriends: [123, 532], '56': 50 }
      };
      expect(getValueFromPath(context, 'user.bestFriends')).toEqual([123, 532]);
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
        expect(getValueFromPath(context, 'company', 'default')).toBe('default');
      });
    });
  });
});

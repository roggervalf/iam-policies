import { toKey } from './toKey';

describe('toKey', () => {
  describe('when converting value to a string key', () => {
    it('should get true', () => {
      const symbol = Symbol(1);
      expect(toKey(1)).toEqual('1');
      expect(toKey(symbol)).toEqual(symbol);
      expect(toKey(-0)).toEqual('-0');
    });
  });
});

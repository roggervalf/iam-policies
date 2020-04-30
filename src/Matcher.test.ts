import { Matcher } from './Matcher';

describe('Matcher Class', () => {
  describe('when creating identity based policy', () => {
    it("don't throw an error", () => {
      expect(() => new Matcher('secrets:123:*')).not.toThrow();
    });

    it('returns a Matcher instance', () => {
      expect(new Matcher('secrets:123:*')).toBeInstanceOf(Matcher);
    });
  });

  describe('when match strings', () => {
    it('returns true', () => {
      expect(new Matcher('*').match('secrets::999/image')).toBe(true);
      expect(new Matcher('secrets:123').match('secrets:123')).toBe(true);
      expect(
        new Matcher('secrets:*:something').match('secrets:123:something')
      ).toBe(true);
    });

    it('returns false', () => {
      expect(new Matcher('secrets:123').match('secrets:124')).toBe(false);
      expect(new Matcher('secrets:123:*').match('secrets:124:something')).toBe(
        false
      );
      expect(
        new Matcher('secrets:*:something').match('secrets:123:other')
      ).toBe(false);
    });
  });
});

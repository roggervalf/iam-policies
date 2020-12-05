import { Matcher } from './Matcher';

describe('Matcher Class', () => {
  describe('when creating a Matcher instance', () => {
    it("doesn't throw an error", () => {
      expect(() => new Matcher('secrets:123:*')).not.toThrow();
    });

    it('throws a TypeError', () => {
      const expectedError = new TypeError('Pattern is too long');

      expect(() => new Matcher('secrets:123:*', 5)).toThrow(expectedError);
    });

    it('returns a Matcher instance', () => {
      expect(new Matcher('secrets:123:*')).toBeInstanceOf(Matcher);
    });
  });

  describe('when match strings', () => {
    describe('when using an invalid regex pattern', () => {
      it('returns false with any string', () => {
        expect(new Matcher('\\(*)').match('')).toBe(false);
        expect(new Matcher('\\(*)').match('word')).toBe(false);
      });
    });

    describe('when pattern is an empty string', () => {
      it('returns true', () => {
        expect(new Matcher('').match('')).toBe(true);
      });
    });

    it('returns true', () => {
      expect(new Matcher('*').match('secrets::999/image')).toBe(true);
      expect(new Matcher('number{125}').match('number125')).toBe(true);
      expect(new Matcher('number${125}').match('number{125}')).toBe(true);
      expect(new Matcher('{125,126}').match('125')).toBe(true);
      expect(new Matcher('secrets:123').match('secrets:123')).toBe(true);
      expect(
        new Matcher('secrets:*:something').match('secrets:123:something')
      ).toBe(true);
    });

    it('returns false', () => {
      expect(new Matcher('{,}').match('')).toBe(false);
      expect(new Matcher('secrets:123').match('secrets:124')).toBe(false);
      expect(new Matcher('secrets:123:*').match('secrets:123')).toBe(false);
      expect(new Matcher('secrets:123:*').match('secrets:124:something')).toBe(
        false
      );
      expect(
        new Matcher('secrets:*:something').match('secrets:123:other')
      ).toBe(false);
      expect(
        new Matcher('secrets:*:something').match('secrets::something')
      ).toBe(false);
    });
  });
});

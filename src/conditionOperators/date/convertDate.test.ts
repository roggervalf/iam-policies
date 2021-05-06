import { convertDate } from './convertDate';

describe('convertDate', () => {
  describe('when passing a Date instance', () => {
    it('returns time in milliseconds', () => {
      const date1 = new Date('December 17, 1995 03:24:00');
      const date2 = new Date('December 18, 1995 03:24:00');

      expect(convertDate(date1)).toBe(date1.getTime());
      expect(convertDate(date2)).toBe(date2.getTime());
    });
  });

  describe('when passing a string', () => {
    it('returns time in milliseconds', () => {
      const date1 = new Date('December 17, 1995 03:24:00');
      const date2 = new Date('December 15, 1991 03:24:00');

      expect(convertDate(date1.toISOString())).toBe(date1.getTime());
      expect(convertDate(date2.toISOString())).toBe(date2.getTime());
    });
  });
});

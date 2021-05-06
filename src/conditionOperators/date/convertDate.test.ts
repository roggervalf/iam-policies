import { convertDate } from './convertDate';

describe('convertDate', () => {
  describe('when passing a Date instance', () => {
    it('returns time in milliseconds', () => {
      expect(convertDate(new Date('December 17, 1995 03:24:00'))).toBe(819188640000);
      expect(convertDate(new Date('December 18, 1995 03:24:00'))).toBe(819275040000);
    });
  });

  describe('when passing a string', () => {
  it('returns time in milliseconds', () => {
    expect(convertDate('December 17, 1995 03:24:00')).toBe(819188640000);
    expect(convertDate('December 15, 1991 03:24:00')).toBe(692785440000);
  });
});
});

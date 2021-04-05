import { dateEquals } from './dateEquals';

describe('dateEquals', () => {
  it('returns true', () => {
    expect(dateEquals(new Date('December 17, 1995 03:24:00'), 'December 17, 1995 03:24:00')).toBeTruthy;
    expect(dateEquals('December 15, 1994 03:24:00', new Date('December 15, 1994 03:24:00'))).toBeTruthy;
  });

  it('returns false', () => {
    expect(dateEquals(new Date('December 17, 1995 03:24:00'), new Date('December 18, 1995 03:24:00'))).toBeFalsy;
    expect(dateEquals('December 15, 1991 03:24:00', new Date('December 17, 1995 03:24:00'))).toBeFalsy;
  });
});

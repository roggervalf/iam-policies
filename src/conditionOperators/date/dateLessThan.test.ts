import { dateLessThan } from './dateLessThan';

describe('dateLessThan', () => {
  it('returns true', () => {
    expect(dateLessThan(new Date('December 17, 1995 03:24:00'), 'December 18, 2000 03:24:00')).toBeTruthy;
    expect(dateLessThan('December 15, 1994 03:24:00', new Date('December 15, 1994 03:25:00'))).toBeTruthy;
  });

  it('returns false', () => {
    expect(dateLessThan(new Date('December 17, 1995 03:24:00'), 'December 17, 1995 03:24:00')).toBeFalsy;
    expect(dateLessThan(new Date('December 17, 1995 03:24:00'), new Date('December 16, 1995 03:24:00'))).toBeFalsy;
  });
});

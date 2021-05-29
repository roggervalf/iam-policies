import { dateLessThanEquals } from './dateLessThanEquals';

describe('dateLessThanEquals', () => {
  it('returns true', () => {
    expect(dateLessThanEquals(new Date('December 17, 1995 03:24:00'), 'December 18, 2000 03:24:00')).toBeTruthy;
    expect(dateLessThanEquals('December 15, 1994 03:24:00', new Date('December 15, 1994 03:24:00'))).toBeTruthy;
  });

  it('returns false', () => {
    expect(dateLessThanEquals(new Date('December 17, 1995 03:24:00'), 'December 17, 1995 03:23:00')).toBeFalsy;
    expect(dateLessThanEquals(new Date('December 17, 1995 03:24:00'), new Date('December 16, 1995 03:24:00')))
    .toBeFalsy;
  });
});

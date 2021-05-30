import { dateGreaterThan } from './dateGreaterThan';

describe('dateGreaterThan', () => {
  it('returns true', () => {
    expect(dateGreaterThan(new Date('December 17, 1995 03:24:00'), 'December 16, 2000 03:24:00')).toBeTruthy;
    expect(dateGreaterThan('December 15, 1994 03:24:00', new Date('December 15, 1994 03:23:00'))).toBeTruthy;
  });

  it('returns false', () => {
    expect(dateGreaterThan(new Date('December 17, 1995 03:24:00'), 'December 17, 1995 03:24:00')).toBeFalsy;
    expect(dateGreaterThan(new Date('December 15, 1995 03:24:00'), new Date('December 16, 1995 03:24:00'))).toBeFalsy;
  });
});

import { dateGreaterThanEquals } from './dateGreaterThanEquals';

describe('dateGreaterThanEquals', () => {
  it('returns true', () => {
    expect(
      dateGreaterThanEquals(
        new Date('December 17, 1995 03:24:00'),
        'December 16, 2000 03:24:00'
      )
    ).toBeTruthy;
    expect(
      dateGreaterThanEquals(
        'December 15, 1994 03:24:00',
        new Date('December 15, 1994 03:24:00')
      )
    ).toBeTruthy;
  });

  it('returns false', () => {
    expect(
      dateGreaterThanEquals(
        new Date('December 17, 1995 03:24:00'),
        'December 17, 1995 03:25:00'
      )
    ).toBeFalsy;
    expect(
      dateGreaterThanEquals(
        new Date('December 15, 1995 03:24:00'),
        new Date('December 16, 1995 03:24:00')
      )
    ).toBeFalsy;
  });
});

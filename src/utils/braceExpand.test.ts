import { braceExpand } from './braceExpand';

describe('braceExpand', () => {
  it('expands with same order', () => {
    expect(braceExpand('a{b,f,m}p')).toMatchObject(['abp', 'afp', 'amp']);
  });

  describe('when ${ is present', () => {
    it('ignores {}', () => {
      expect(braceExpand('${13}')).toMatchObject(['{13}']);
      expect(braceExpand('${13}$${ab}')).toMatchObject(['{13}${ab}']);
      expect(braceExpand('${13}a$b${ab}')).toMatchObject(['{13}a$b{ab}']);
      expect(braceExpand('${a,b}${c,d}')).toMatchObject(['{a,b}{c,d}']);
      expect(braceExpand('x${a,b}x${c,d}x')).toMatchObject(['x{a,b}x{c,d}x']);
      expect(braceExpand('x${a,b}x{y,w}${c,d}x')).toMatchObject([
        'x{a,b}xy{c,d}x',
        'x{a,b}xw{c,d}x'
      ]);
    });
  });

  describe('when there is an empty option', () => {
    it('expands as many times as empty spaces', () => {
      expect(braceExpand('-v{,,,,}')).toMatchObject([
        '-v',
        '-v',
        '-v',
        '-v',
        '-v'
      ]);
    });
  });
});

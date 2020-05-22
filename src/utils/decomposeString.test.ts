import { decomposeString } from './decomposeString';

describe('decomposeString', () => {
  it('should find both separators', () => {
    expect(decomposeString('first', 'Second', 'firstAndSecond')).toEqual({
      start: 0,
      end: 8,
      pre: '',
      body: 'And',
      post: ''
    });
    expect(decomposeString('First', 'Second', '++FirstAndSecond**')).toEqual({
      start: 2,
      end: 10,
      pre: '++',
      body: 'And',
      post: '**'
    });
  });
  it('should find only one separator', () => {
    expect(decomposeString('first', 'second', 'firstAndSecond')).toEqual({
      start: -1,
      end: -1,
      pre: '',
      body: '',
      post: ''
    });
    expect(decomposeString('First', 'Second', 'firstAndSecond')).toEqual({
      start: -1,
      end: -1,
      pre: '',
      body: '',
      post: ''
    });
  });
});

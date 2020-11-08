import { applyContext } from './applyContext';

describe('applyContext function', () => {
  it('can match based on context', () => {
    const context = {
      user: { id: 456, bestFriends: [123, 532, 987] }
    };

    expect(applyContext('secrets:${user.id}:*', context)).toBe('secrets:456:*');
    expect(applyContext('secrets:${user.bestFriends}:*', context)).toBe(
      'secrets:{123,532,987}:*'
    );
    expect(applyContext('secrets:${user.bestFriends}:account', context)).toBe(
      'secrets:{123,532,987}:account'
    );
    expect(
      applyContext(
        'secrets:${user.id}:bestFriends:${user.bestFriends}',
        context
      )
    ).toBe('secrets:456:bestFriends:{123,532,987}');
  });

  it('can match non-existed path', () => {
    const context = {
      user: { id: 456, bestFriends: [123, 987] }
    };

    expect(applyContext('secrets:${}:account', context)).toBe(
      'secrets:undefined:account'
    );
    expect(applyContext('secrets:${company.address}:account', context)).toBe(
      'secrets:undefined:account'
    );
  });

  it('can match object values', () => {
    const context = {
      user: { id: 456, address: { lat: 11, long: 52 } }
    };

    expect(applyContext('secrets:${user.address}:account', context)).toBe(
      'secrets:undefined:account'
    );
  });
});

import { applyContext } from '../src/Statement'

it('can match based on context', () => {
  const context = {
    user: { id: 456, bestfriends: [123, 532, 987] },
  }
  expect(applyContext('secrets:${user.id}:*', context)).toBe('secrets:456:*')

  expect(applyContext('secrets:{${user.bestfriends}}:*', context)).toBe(
    'secrets:{123,532,987}:*'
  )
})

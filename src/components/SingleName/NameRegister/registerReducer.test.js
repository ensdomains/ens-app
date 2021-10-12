import { hasReachedState } from './registerReducer'

describe('hasReachedState', () => {
  it('returns true when it has passed ', () => {
    const result = hasReachedState('COMMIT_SENT', 'COMMIT_CONFIRMED')
    const expected = true
    expect(result).toEqual(expected)
  })

  it('returns false when it has not passed ', () => {
    const result = hasReachedState('COMMIT_CONFIRMED', 'COMMIT_SENT')
    const expected = false
    expect(result).toEqual(expected)
  })

  it('returns true when it is the same state ', () => {
    const result = hasReachedState('COMMIT_CONFIRMED', 'COMMIT_CONFIRMED')
    const expected = true
    expect(result).toEqual(expected)
  })
})

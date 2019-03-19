import {
  getStates,
  hasReachedState,
  registerMachine,
  registerReducer
} from './registerReducer'

test('getStates returns the correct states in order', () => {
  expect(
    getStates(
      {
        blah: {
          on: {
            NEXT: 'blah2'
          }
        },
        blah2: {
          on: {
            NEXT: 'blah2'
          }
        }
      },
      'blah'
    )
  ).toEqual(['blah', 'blah2'])
})

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

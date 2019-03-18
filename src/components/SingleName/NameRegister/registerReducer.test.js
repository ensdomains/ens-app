import {
  getStates,
  hasStatePassed,
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

describe('hasStatePassed', () => {
  it('returns false when it has not passed ', () => {
    expect(hasStatePassed('COMMIT_SENT', 'COMMIT_CONFIRMED')).toEqual(false)
  })

  it('returns true when it has passed ', () => {
    expect(hasStatePassed('COMMIT_CONFIRMED', 'COMMIT_SENT')).toEqual(true)
  })
})

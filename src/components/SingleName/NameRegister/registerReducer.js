import registerReducerFactory from '../registerReducerFactory'

export const registerMachine = {
  initialState: 'PRICE_DECISION',
  states: {
    PRICE_DECISION: {
      on: {
        NEXT: 'COMMIT_SENT',
        PREVIOUS: 'PRICE_DECISION'
      }
    },
    COMMIT_SENT: {
      on: {
        NEXT: 'COMMIT_CONFIRMED',
        PREVIOUS: 'PRICE_DECISION'
      }
    },
    COMMIT_CONFIRMED: {
      on: {
        NEXT: 'AWAITING_REGISTER',
        PREVIOUS: 'COMMIT_SENT'
      }
    },
    AWAITING_REGISTER: {
      on: {
        NEXT: 'REVEAL_SENT',
        PREVIOUS: 'COMMIT_CONFIRMED'
      }
    },
    REVEAL_SENT: {
      on: {
        NEXT: 'REVEAL_CONFIRMED',
        PREVIOUS: 'AWAITING_REGISTER'
      }
    },
    REVEAL_CONFIRMED: {
      on: {
        NEXT: 'REVEAL_CONFIRMED',
        PREVIOUS: 'REVEAL_SENT'
      }
    }
  }
}

export const { registerReducer, hasReachedState } = registerReducerFactory(
  registerMachine
)

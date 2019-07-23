import registerReducerFactory from '../registerReducerFactory'

export const registerMachine = {
  initialState: 'ENABLE_DNSSEC',
  states: {
    ENABLE_DNSSEC: {
      on: {
        NEXT: 'ADD_TEXT'
      }
    },
    ADD_TEXT: {
      on: {
        NEXT: 'SUBMIT_PROOF'
      }
    },
    SUBMIT_PROOF: {
      on: {
        NEXT: 'SUBMIT_SENT'
      }
    },
    SUBMIT_SENT: {
      on: {
        NEXT: 'SUBMIT_CONFIRMED'
      }
    },
    SUBMIT_CONFIRMED: {
      on: {
        NEXT: 'SUBMIT_CONFIRMED'
      }
    }
  }
}

export const { registerReducer, hasReachedState } = registerReducerFactory(
  registerMachine
)

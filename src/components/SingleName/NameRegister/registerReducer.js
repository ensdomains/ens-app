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

export function registerReducer(state, action) {
  return registerMachine.states[state].on[action] || state
}

export function getStates(states, initialState) {
  function traverseLinkedList(list, next) {
    if (states[next].on.NEXT === next) {
      return [...list, next]
    }
    return traverseLinkedList([...list, next], states[next].on.NEXT)
  }
  return traverseLinkedList([], initialState)
}

export const states = getStates(
  registerMachine.states,
  registerMachine.initialState
)

export const hasReachedState = (state, currentState) => {
  const indexToReach = states.findIndex(s => s === state)
  const currentStateIndex = states.findIndex(s => s === currentState)
  return currentStateIndex >= indexToReach
}

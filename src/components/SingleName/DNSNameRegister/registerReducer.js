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

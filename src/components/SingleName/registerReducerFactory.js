const registerReducerFactory = registerMachine => {
  const getStates = (states, initialState) => {
    function traverseLinkedList(list, next) {
      if (states[next].on.NEXT === next) {
        return [...list, next]
      }
      return traverseLinkedList([...list, next], states[next].on.NEXT)
    }
    return traverseLinkedList([], initialState)
  }

  const registerReducer = (state, action) => {
    return registerMachine.states[state].on[action] || state
  }

  const states = getStates(registerMachine.states, registerMachine.initialState)

  const hasReachedState = (state, currentState) => {
    const indexToReach = states.findIndex(s => s === state)
    const currentStateIndex = states.findIndex(s => s === currentState)
    return currentStateIndex >= indexToReach
  }

  return {
    registerReducer,
    hasReachedState
  }
}

export default registerReducerFactory

import { useEffect, useReducer } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [])
}

export function useScrollTo(pos) {
  useEffect(() => {
    window.scrollTo(0, pos)
  }, [])
}

export function useEditable(
  initialState = {
    editing: false,
    newValue: '',
    pending: false,
    confirmed: false,
    txHash: undefined
  }
) {
  const types = {
    UPDATE_VALUE: 'UPDATE_VALUE',
    UPDATE_VALUE_DIRECT: 'UPDATE_VALUE_DIRECT',
    START_EDITING: 'START_EDITING',
    STOP_EDITING: 'STOP_EDITING',
    START_PENDING: 'START_PENDING',
    SET_CONFIRMED: 'SET_CONFIRMED'
  }

  function reducer(state, action) {
    switch (action.type) {
      case types.UPDATE_VALUE:
        return {
          newValue: action.event.target.value
        }
      case types.UPDATE_VALUE_DIRECT:
        return {
          newValue: action.value
        }
      case types.START_EDITING:
        return { editing: true, confirmed: false, pending: false }
      case types.STOP_EDITING:
        return { editing: true, confirmed: false, pending: false }
      case types.START_PENDING:
        return { pending: true, editing: false, txHash: action.txHash }
      case types.SET_CONFIRMED:
        return { pending: false, confirmed: true }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return {
    state,
    dispatch,
    types
  }
}

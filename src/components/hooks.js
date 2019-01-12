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
    START_EDITING: 'START_EDITING',
    STOP_EDITING: 'STOP_EDITING',
    START_PENDING: 'START_PENDING',
    SET_CONFIRMED: 'SET_CONFIRMED'
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const startEditing = () => dispatch({ type: types.START_EDITING })
  const stopEditing = () => dispatch({ type: types.STOP_EDITING })
  const updateValue = value => dispatch({ type: types.UPDATE_VALUE, value })
  const startPending = txHash => dispatch({ type: types.START_PENDING, txHash })
  const setConfirmed = () => dispatch({ type: types.SET_CONFIRMED })

  const actions = {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed
  }

  function reducer(state, action) {
    switch (action.type) {
      case types.UPDATE_VALUE:
        return {
          ...state,
          newValue: action.value
        }
      case types.START_EDITING:
        return { ...state, editing: true, confirmed: false, pending: false }
      case types.STOP_EDITING:
        return { ...state, editing: false, confirmed: false, pending: false }
      case types.START_PENDING:
        return {
          ...state,
          pending: true,
          editing: false,
          txHash: action.txHash
        }
      case types.SET_CONFIRMED:
        return { ...state, pending: false, confirmed: true }
      default:
        return state
    }
  }

  return {
    state,
    actions
  }
}

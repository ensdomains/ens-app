// graphql data in resolver and records to check current records
// state in resolver and records to record new edit changes
// check old and new to see if any have changed
// abstract build tx data into function and use it here
//

function reducer(state, action) {
  switch (action.type) {
    case 'EDIT_RECORD':
      return {
        ...state,
        [action.record.name]: action.record
      }
    case 'ADD_RECORD':
      return {
        ...state,
        [action.record.name]: action.record
      }
  }
}

const [state, dispatch] = useReducer(reducer, {})

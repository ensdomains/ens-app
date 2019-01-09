import { Component } from 'react'

class Editable extends Component {
  state = {
    editing: false,
    newValue: '',
    pending: false,
    confirmed: false,
    txHash: undefined
  }

  updateValue = e => {
    this.setState({ newValue: e.target.value })
  }
  updateValueDirect = value => this.setState({ newValue: value })
  startEditing = () =>
    this.setState({ editing: true, confirmed: false, pending: false })
  stopEditing = () => this.setState({ editing: false })
  startPending = txHash =>
    this.setState({ pending: true, editing: false, txHash })
  setConfirmed = () => {
    this.setState({ pending: false, confirmed: true })
  }

  render() {
    return this.props.children({
      //Editing state
      editing: this.state.editing,
      startEditing: this.startEditing,
      stopEditing: this.stopEditing,
      //Input Value
      newValue: this.state.newValue,
      updateValue: this.updateValue,
      updateValueDirect: this.updateValueDirect,
      txHash: this.state.txHash,
      pending: this.state.pending,
      confirmed: this.state.confirmed,
      startTransaction: this.startTransaction,
      startPending: this.startPending,
      setConfirmed: this.setConfirmed
    })
  }
}

export default Editable

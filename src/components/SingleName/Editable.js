import { Component } from 'react'

class Editable extends Component {
  state = {
    editing: false,
    newValue: '',
    started:false,
    pending: false,
    confirmed: false
  }

  updateValue = e => {
    this.setState({ newValue: e.target.value })
  }
  updateValueDirect = value => this.setState({ newValue: value })
  startEditing = () =>
    this.setState({ editing: true, confirmed: false, pending: false })
  stopEditing = () => this.setState({ editing: false })
  startTransaction = () => this.setState({ started: true })
  startPending = () => this.setState({ pending: true, editing: false })
  setConfirmed = () => this.setState({ pending: false, confirmed: true, started:false })

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
      //trigger pending state
      started: this.state.started,
      pending: this.state.pending,
      confirmed: this.state.confirmed,
      startTransaction: this.startTransaction,
      startPending: this.startPending,
      setConfirmed: this.setConfirmed
    })
  }
}

export default Editable

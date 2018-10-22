import { Component } from 'react'

class Editable extends Component {
  state = {
    editing: false,
    newValue: '',
    pending: false,
    confirmed: false
  }

  updateValue = e => {
    this.setState({ newValue: e.target.value })
    console.log(e)
  }
  startEditing = () => this.setState({ editing: true })
  stopEditing = () => this.setState({ editing: false })
  startPending = () => this.setState({ pending: true, editing: false })
  setConfirmed = () => this.setState({ pending: true, confirmed: true })

  render() {
    return this.props.children({
      //Editing state
      editing: this.state.editing,
      startEditing: this.startEditing,
      stopEditing: this.stopEditing,
      //Input Value
      newValue: this.state.newValue,
      updateValue: this.updateValue,
      //trigger pending state
      pending: this.state.pending,
      confirmed: this.state.confirmed,
      startPending: this.startPending,
      setConfirmed: this.setConfirmed
    })
  }
}

export default Editable

import { Component } from 'react'

class Editable extends Component {
  state = {
    editing: false,
    newValue: '',
    pending: false
  }

  updateValue = e => {
    this.setState({ newValue: e.target.value })
    console.log(e)
  }
  startEditing = () => this.setState({ editing: true })
  stopEditing = () => this.setState({ editing: false })
  startPending = () => this.setState({ pending: true })
  stopPending = () => this.setState({ pending: true })

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
      startPending: this.startPending,
      stopPending: this.stopPending
    })
  }
}

export default Editable

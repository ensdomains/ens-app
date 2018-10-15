import { Component } from 'react'

class Editable extends Component {
  state = {
    editing: false,
    newValue: ''
  }

  updateValue = e => {
    this.setState({ newValue: e.target.value })
    console.log(e)
  }
  startEditing = () => this.setState({ editing: true })
  stopEditing = () => this.setState({ editing: false })

  render() {
    return this.props.children({
      editing: this.state.editing,
      newValue: this.state.newValue,
      startEditing: this.startEditing,
      stopEditing: this.stopEditing,
      updateValue: this.updateValue
    })
  }
}

export default Editable

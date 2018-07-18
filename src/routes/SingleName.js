import React, { Component } from 'react'
import { validateName, parseSearchTerm } from '../lib/utils'

class SingleName extends Component {
  state = {
    valid: false
  }
  componentDidMount() {
    const searchTerm = this.props.match.params.name
    const validity = parseSearchTerm(searchTerm)
    if (parseSearchTerm(this.props.match.params.name) === 'eth') {
      this.setState({
        valid: true
      })
    } else {
      this.setState({
        valid: false
      })
    }
  }
  render() {
    const searchTerm = this.props.match.params.name
    if (this.state.valid) {
      return <div>Details for {searchTerm}</div>
    }

    return <div>Invalid domain name {searchTerm}</div>
  }
}

export default SingleName

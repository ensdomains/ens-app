import React, { Component } from 'react'

class SingleName extends Component {
  render() {
    console.log(this.props.match)

    return <div>{this.props.match.params.name}</div>
  }
}

export default SingleName

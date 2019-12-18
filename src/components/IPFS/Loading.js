import React, { Component } from 'react'
import styled from '@emotion/styled'

const LoadingBar = styled('div')`
  width: 100%;
  height: 8px;
  background-color: #5284ff;
  border-radius: 5px;
`

const Loaded = styled('div')`
  background-color: 2c46a6;
  height: 100%;
  margin: 0;
  border-radius: 5px;
`

class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <LoadingBar>
        <Loaded style={{ width: this.props.loaded + '%' }} />
      </LoadingBar>
    )
  }
}

export default Loading

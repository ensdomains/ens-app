import React, { Component } from 'react'
import styled from 'react-emotion'

const activeColourSwitch = props => (props.active ? '#5284FF' : '#ccc')

const TickContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 23px;
  width: 23px;
  border-radius: 5px;
  border: 2px solid ${activeColourSwitch};
`

const Svg = styled('svg')`
  path {
    fill: ${activeColourSwitch};
  }
`

class Tick extends Component {
  render() {
    return (
      <TickContainer>
        <Svg width="11" height="8" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.63 0L4.537 5.202 1.37 1.967 0 3.367 4.537 8 11 1.399z"
            fill="#5284FF"
            fill-rule="evenodd"
          />
        </Svg>
      </TickContainer>
    )
  }
}

export default Tick

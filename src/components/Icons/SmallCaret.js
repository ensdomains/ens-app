import React, { Component } from 'react'
import styled from 'react-emotion'

class SmallCaret extends Component {
  render() {
    return (
      <SmallCaretContainer
        width="12"
        height="8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="rotate(180 6 4)" fill="#2B2B2B" fill-rule="evenodd">
          <rect
            transform="rotate(45 8.76 4.141)"
            x="4.574"
            y="3.357"
            width="8.373"
            height="1.568"
            rx=".784"
          />
          <rect
            transform="scale(1 -1) rotate(45 13.653 0)"
            x="-.531"
            y="3.357"
            width="8.373"
            height="1.568"
            rx=".784"
          />
        </g>
      </SmallCaretContainer>
    )
  }
}

const SmallCaretContainer = styled('svg')``

export default SmallCaret

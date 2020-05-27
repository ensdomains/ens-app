import React, { Component } from 'react'
import styled from '@emotion/styled/macro'

const CaretContainer = styled('div')`
  background: white;
  display: flex;
  align-items: center;
  padding: 0 30px;

  g {
    fill: #e7e7e7;
  }

  &:hover {
    cursor: pointer;

    g {
      transition: fill 0.2s ease-out, transform 0.2s ease-out;
      fill: #5284ff;
    }
  }

  .left {
    transform: rotate(-45 6.937 6.047);
  }

  .right {
    transform: scale(1 -1) rotate(-45 43.667 0);
  }
`

class Caret extends Component {
  render() {
    return (
      <CaretContainer type={'up'} onClick={this.props.onClick}>
        <svg width="21" height="11" xmlns="http://www.w3.org/2000/svg">
          <g
            transform={
              this.props.up ? 'rotate(90 11.5 10)' : 'rotate(-90 6.5 6.5)'
            }
            fillRule="evenodd"
          >
            <rect
              className="left"
              transform="rotate(45 6.937 6.047)"
              x="-.263"
              y="4.828"
              width="14.4"
              height="2.438"
              rx="1.219"
            />
            <rect
              className="right"
              transform="scale(1 -1) rotate(45 43.667 0)"
              x="-.263"
              y="13.995"
              width="14.4"
              height="2.438"
              rx="1.219"
            />
          </g>
        </svg>
      </CaretContainer>
    )
  }
}

export default Caret

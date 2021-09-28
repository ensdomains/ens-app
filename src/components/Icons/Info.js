import React, { Component } from 'react'
import styled from '@emotion/styled/macro'

class Info extends Component {
  render() {
    const { className, onClick, onMouseOver, onMouseLeave } = this.props

    return (
      <InfoContainer
        width="18"
        height="18"
        className={className}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        <g
          id="Designs"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="Records-V1"
            transform="translate(-1177.000000, -525.000000)"
            fill="#ADBBCD"
          >
            <path
              d="M1186,543 C1181.02944,543 1177,538.970563 1177,534 C1177,529.029437 1181.02944,525 1186,525 C1190.97056,525 1195,529.029437 1195,534 C1195,538.970563 1190.97056,543 1186,543 Z M1185,532 L1185,538.5 L1187,538.5 L1187,532 L1185,532 Z M1186,531 C1186.55228,531 1187,530.552285 1187,530 C1187,529.447715 1186.55228,529 1186,529 C1185.44772,529 1185,529.447715 1185,530 C1185,530.552285 1185.44772,531 1186,531 Z"
              id="info-icon"
            />
          </g>
        </g>
      </InfoContainer>
    )
  }
}

const InfoContainer = styled('svg')`
  opacity: 1 !important;
  margin-left: 0px !important;
  margin-right: 5px;
`

export default Info

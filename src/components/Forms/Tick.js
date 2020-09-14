import React from 'react'
import styled from '@emotion/styled/macro'

const activeColourSwitch = props => (props.active ? '#5284FF' : '#B0BECF')

const TickContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 23px;
  width: 23px;

  border-radius: 5px;
  border: 2px solid ${activeColourSwitch};
`

const TickContainerDouble = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;

  border-radius: 3px;

  box-shadow: 0 0 0 2px ${activeColourSwitch}, -5px -5px 0 0 white,
    -5px -5px 0 2px ${activeColourSwitch};
`

const Svg = styled('svg')`
  margin-top: 2px;
  path {
    fill: ${activeColourSwitch};
    opacity: ${props => (props.active || props.hover ? '1' : '0')};
  }
`

const Tick = ({ active, className, hover }) => (
  <TickContainer className={className} active={active}>
    <Svg
      width="11"
      height="8"
      xmlns="http://www.w3.org/2000/svg"
      active={active}
      hover={hover}
    >
      <path
        d="M9.63 0L4.537 5.202 1.37 1.967 0 3.367 4.537 8 11 1.399z"
        fillRule="evenodd"
      />
    </Svg>
  </TickContainer>
)

export default Tick

export const DoubleBorderTick = ({ active, className, hover }) => (
  <TickContainerDouble className={className} active={active}>
    <Svg
      width="11"
      height="8"
      xmlns="http://www.w3.org/2000/svg"
      active={active}
      hover={hover}
    >
      <path
        d="M9.63 0L4.537 5.202 1.37 1.967 0 3.367 4.537 8 11 1.399z"
        fillRule="evenodd"
      />
    </Svg>
  </TickContainerDouble>
)

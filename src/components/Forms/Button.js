import React from 'react'
import styled from 'react-emotion'

const ButtonContainer = styled('button')`
  color: white;
  background: ${p => p.color};
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  font-family: Overpass;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  box-shadow: 0 10px 21px 0 #bed0dc;

  &:hover {
    cursor: pointer;
  }
`

const types = {
  primary: '#5384FE'
}

const Button = ({ children, type }) => (
  <ButtonContainer color={types[type]}>{children}</ButtonContainer>
)

export default Button

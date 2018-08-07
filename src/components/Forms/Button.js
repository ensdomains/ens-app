import React from 'react'
import styled from 'react-emotion'

const ButtonContainer = styled('button')`
  color: white;
  background: ${p => p.color};
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  font-family: Overpass;
  text-transform: uppercase;
  letter-spacing: 2px;

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

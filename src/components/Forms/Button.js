import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

const ButtonContainer = styled(Link)`
  color: white;
  background: ${p => p.color};
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  font-family: Overpass;
  text-transform: capitalize;
  letter-spacing: 1.5px;
  //box-shadow: 0 10px 21px 0 #bed0dc;
  transition: 0.2s all;

  &:hover {
    cursor: ${p => (p.href ? 'pointer' : 'auto')};
    background: #2c46a6;
    box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
    border-radius: 23px;
  }
`

const types = {
  primary: '#5384FE'
}

const Button = ({ children, type = 'primary', href }) => (
  <ButtonContainer to={href || ''} color={types[type]} href={href}>
    {children}
  </ButtonContainer>
)

export default Button

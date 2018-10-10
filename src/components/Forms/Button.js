import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

const ButtonContainer = styled('button')`
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
    cursor: pointer;
    background: #2c46a6;
    box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
    border-radius: 23px;
  }

  a {
    color: white;
    &:focus {
      outline: 0;
    }
  }
`

const types = {
  primary: '#5384FE',
  inactive: '#DFDFDF',
  hollow: 'transparent'
}

const Button = ({ children, type = 'primary', onClick }) => (
  <ButtonContainer color={types[type]} onClick={onClick}>
    {children}
  </ButtonContainer>
)

export const ButtonLink = ({ children, type = 'primary', to = '' }) => (
  <ButtonContainer color={types[type]}>
    <Link to={to}>{children}</Link>
  </ButtonContainer>
)

export default Button

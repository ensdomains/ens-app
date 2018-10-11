import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

function getButtonStyles(type) {
  switch (type) {
    case 'hollow':
      return `
        color: #DFDFDF;
        border: 2px solid #DFDFDF;
      `
    default:
      return ''
  }
}

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
  border: 2px solid #5384FE

  &:hover {
    cursor: pointer;
    background: #2c46a6;
    box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
    border-radius: 23px;
  }

  ${({ type }) => getButtonStyles(type)} a {
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

const Button = ({ children, type = 'primary', onClick, className }) => (
  <ButtonContainer
    className={className}
    color={types[type]}
    type={type}
    onClick={onClick}
  >
    {children}
  </ButtonContainer>
)

export const ButtonLink = ({ children, type = 'primary', to = '' }) => (
  <ButtonContainer color={types[type]}>
    <Link to={to}>{children}</Link>
  </ButtonContainer>
)

export default Button

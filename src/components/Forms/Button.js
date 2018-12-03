import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

function getButtonStyles({ type, color }) {
  switch (type) {
    case 'primary':
      return `
        &:hover {
          cursor: pointer;
          border: 2px solid ${color[1]};
          background: #2c46a6;
          box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
          border-radius: 23px;
        }
      `
    case 'hollow':
      return `
        color: #DFDFDF;
        border: 2px solid #DFDFDF;
        &:hover {
          cursor: pointer;
          border: 2px solid ${color[1]};
          background: #2c46a6;
          box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
        }
      `
    case 'disabled':
      return `
        &:hover {
          cursor: default
        }
        
      `
    default:
      return ''
  }
}

function getButtonDefaultStyles(p) {
  return `
    color: white;
    background: ${p.color[0]};
    padding: 10px 25px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 700;
    font-family: Overpass;
    text-transform: capitalize;
    letter-spacing: 1.5px;
    //box-shadow: 0 10px 21px 0 #bed0dc;
    transition: 0.2s all;
    border: 2px solid ${p.color[0]};

    &:focus {
      outline: 0;
    }
  `
}

const ButtonContainer = styled('button')`
  ${p => getButtonDefaultStyles(p)};
  ${p => getButtonStyles(p)};
`

const ButtonLinkContainer = styled(Link)`
  color: white;
  &:hover {
    color: white;
  }
  &:visited {
    color: white;
  }
  ${p => getButtonDefaultStyles(p)};
  ${p => getButtonStyles(p)};
`

const types = {
  primary: ['#5384FE', '#2c46a6'],
  inactive: ['#DFDFDF', '#DFDFDF'],
  hollow: ['transparent', 'transparent'],
  disabled: ['#ccc', '#ccc']
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

export const ButtonLink = ({
  className,
  children,
  type = 'primary',
  to = ''
}) => (
  <ButtonLinkContainer
    className={className}
    to={to}
    color={types[type]}
    type={type}
  >
    {children}
  </ButtonLinkContainer>
)

export default Button

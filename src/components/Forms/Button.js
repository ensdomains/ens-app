import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

function getButtonStyles({ type, color }) {
  switch (type) {
    case 'primary':
      return `
        &:hover {
          cursor: pointer;
          border: 2px solid #2c46a6;
          background: #2c46a6;
          box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
          border-radius: 23px;
        }
      `
    case 'hollow':
      return `
        background: transparent;
        color: #DFDFDF;
        border: 2px solid #DFDFDF;
        &:hover {
          cursor: pointer;
          border: 2px solid transparent;
          background: #2c46a6;
          box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
        }
      `
    case 'hollow-primary':
      return `
        color: #5384FE;
        background: transparent;
        border: 2px solid #5384FE;
        &:hover {
          cursor: pointer;
          border: 2px solid #2C46A6;
          color: #2C46A6;
        }
      `
    case 'disabled':
      return `
        background: #ccc
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
    background: #5384FE;
    padding: 10px 25px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 700;
    font-family: Overpass;
    text-transform: capitalize;
    letter-spacing: 1.5px;
    //box-shadow: 0 10px 21px 0 #bed0dc;
    transition: 0.2s all;
    border: 2px solid #5384FE;

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

// const types = {
//   primary: ['#5384FE', '#2c46a6'],
//   inactive: ['#DFDFDF', '#DFDFDF'],
//   hollow: ['transparent', 'transparent'],
//   "hollow-primary": ['trans']
//   disabled: ['#ccc', '#ccc']
// }

const Button = props => {
  const { className, children, type = 'primary', onClick } = props
  return (
    <ButtonContainer
      className={className}
      type={type}
      onClick={onClick}
      disabled={type === 'disabled'}
      {...props}
    >
      {children}
    </ButtonContainer>
  )
}

export const ButtonLink = props => {
  const { className, children, type = 'primary', to = '' } = props
  return (
    <ButtonLinkContainer className={className} to={to} type={type} {...props}>
      {children}
    </ButtonLinkContainer>
  )
}

export default Button

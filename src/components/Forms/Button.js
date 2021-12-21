import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'

function getButtonStyles({ type }) {
  switch (type) {
    case 'primary':
      return `
        &:visited {
          color: white;
        }
        &:hover {
          cursor: pointer;
          border: 2px solid #282929;
          background: #282929;
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
          background: #282929;
          box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
        }
      `
    case 'hollow-white':
      return `
        background: transparent;
        color: white;
        border: 2px solid #fff;
        &:visited {
          color: white;
        }
        &:hover {
          color: white;
          cursor: pointer;
          border: 2px solid transparent;
          background: #282929;
          box-shadow: 0 10px 21px 0 rgba(161, 175, 184, 0.89);
        }
      `
    case 'hollow-primary':
      return `
        color: #282929;
        background: transparent;
        border: 2px solid #282929;
        &:visited {
          color: #282929;
        }
        &:hover {
          cursor: pointer;
          border: 2px solid #282929;
          color: #282929;
        }
      `
    case 'hollow-primary-disabled':
      return `
        color: #dfdfdf;
        background: transparent;
        border: 2px solid #dfdfdf;
        &:visited {
          color: #dfdfdf;
        }
        &:hover {
          color: #dfdfdf;
          cursor: default
        }
      `
    case 'disabled':
      return `
        border: 2px solid #dfdfdf;
        background: #dfdfdf;
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
    background: #282929;
    padding: 10px 25px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 700;
    font-family: Overpass;
    text-transform: capitalize;
    letter-spacing: 1.5px;
    transition: 0.2s all;
    border: 2px solid #282929;
    text-align: center;

    &:focus {
      outline: 0;
    }
  `
}

const ButtonContainer = styled('button')`
  ${p => getButtonDefaultStyles(p)};
  ${p => getButtonStyles(p)};
`

const ExternalButtonLinkContainer = styled('a')`
  text-decoration: none;
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

const Button = props => {
  const { className, children, type = 'primary', onClick } = props
  return (
    <ButtonContainer
      className={className}
      type={type}
      onClick={onClick}
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

export const ExternalButtonLink = props => {
  const { className, children, type = 'primary', href } = props
  return (
    <ExternalButtonLinkContainer
      className={className}
      href={href}
      type={type}
      {...props}
    >
      {children}
    </ExternalButtonLinkContainer>
  )
}

export default Button

export { getButtonDefaultStyles, getButtonStyles }

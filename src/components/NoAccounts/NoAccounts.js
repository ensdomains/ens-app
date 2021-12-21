import React from 'react'
import styled from '@emotion/styled/macro'

const NoAccountsContainer = styled('div')`
  box-shadow: ${({ active }) =>
    active ? '0 -10px 30px 0 rgba(108, 143, 167, 0.05)' : 'none'};
  padding: 5px 20px;
  border-bottom: 1px solid
    ${({ active, colour }) => (active ? '#F5A623' : colour)};
  border-top: ${({ active, colour }) =>
    `1px solid ${active ? '#fff' : colour}`};
  border-left: ${({ active, colour }) =>
    `1px solid ${active ? '#fff' : colour}`};
  border-right: ${({ active, colour }) =>
    `1px solid ${active ? '#fff' : colour}`};
  border-radius: ${({ active }) => (active ? '6px 6px 0 0' : '6px')};
  background: ${({ active }) => (active ? 'white' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${({ active }) => (active ? '150px' : '150px')};
  transition: 0.2s;

  span {
    color: ${({ active, colour }) => (active ? '#F5A623' : colour)};
  }

  &:hover {
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};
  }
`

const SVG = styled('svg')`
  margin-right: 10px;
`

const NoAccounts = ({
  className,
  colour = '#282929',
  textColour,
  onClick,
  buttonText,
  active
}) => (
  <NoAccountsContainer
    colour={colour}
    className={className}
    onClick={onClick}
    active={active}
    textColour={textColour}
  >
    <span>{buttonText}</span>
  </NoAccountsContainer>
)

export default NoAccounts

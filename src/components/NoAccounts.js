import React from 'react'
import styled from 'react-emotion'

const colour = ({ colour }) => colour

const NoAccountsContainer = styled('div')`
  box-shadow: ${({ active }) =>
    active ? '0 -10px 30px 0 rgba(108, 143, 167, 0.05)' : 'none'};
  padding: 5px 20px;
  border-bottom: 1px solid ${colour};
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
  position: relative;
  width: ${({ active }) => (active ? '305px' : 'auto')};
  transition: 0.2s;
  z-index: 11;

  span {
    color: ${colour};
  }

  &:hover {
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};
  }
`

const SVG = styled('svg')`
  margin-right: 10px;
`

const Exclamation = ({ colour }) => (
  <SVG width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.739 5.82c-.039.746-.096 1.512-.134 2.258-.02.25-.02.268-.02.517a.723.723 0 0 1-.727.708.707.707 0 0 1-.727-.689c-.058-1.167-.134-2.143-.192-3.311l-.057-.938c-.02-.478.268-.9.727-1.034a.972.972 0 0 1 1.13.556c.057.153.095.306.095.478-.019.479-.057.976-.095 1.455m-.88 6.316a.98.98 0 0 1-.977-.976.98.98 0 0 1 .976-.976c.536 0 .976.44.957.995.02.517-.44.957-.957.957M7.93 0a7.93 7.93 0 1 0 0 15.86A7.93 7.93 0 0 0 7.93 0"
      fill={colour || '#ffffff'}
      fill-rule="evenodd"
    />
  </SVG>
)

const NoAccounts = ({ className, colour = '#ffffff', onClick, active }) => (
  <NoAccountsContainer
    colour={colour}
    className={className}
    onClick={onClick}
    active={active}
  >
    <Exclamation colour={colour} />
    <span>No Accounts</span>
  </NoAccountsContainer>
)

export default NoAccounts

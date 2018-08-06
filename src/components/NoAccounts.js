import React from 'react'
import styled from 'react-emotion'

const NoAccountsContainer = styled('div')`
  padding: 0 20px;
  border: 1px solid #fff;
`

const Exclamation = () => (
  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <circle fill="#FFF" cx="8" cy="8" r="8" />
      <text
        font-family="Overpass-ExtraBold, Overpass"
        font-size="12.6"
        font-weight="600"
        fill="#5188FF"
      >
        <tspan x="6" y="12">
          !
        </tspan>
      </text>
    </g>
  </svg>
)

const NoAccounts = ({}) => (
  <NoAccountsContainer>
    <Exclamation /> No Accounts
  </NoAccountsContainer>
)

export default NoAccounts

import React from 'react'
import styled from 'react-emotion'

const NoAccountsContainer = styled('div')`
  padding: 5px 20px;
  border: 1px solid #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;

  span {
    color: white;
  }
`

const SVG = styled('svg')`
  margin-right: 10px;
`

const Exclamation = () => (
  <SVG width="16" height="16" xmlns="http://www.w3.org/2000/svg">
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
  </SVG>
)

const NoAccounts = ({ className }) => (
  <NoAccountsContainer className={className}>
    <Exclamation />
    <span>No Accounts</span>
  </NoAccountsContainer>
)

export default NoAccounts

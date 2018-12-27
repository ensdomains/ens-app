import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import mq from 'mediaQuery'

const TabLink = styled(Link)`
  font-size: 14px;
  background: ${({ active }) => (active ? '#5384FE' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  transform: scale(${({ active }) => (active ? '1.08' : '1')});
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 10px 30px;
  border-radius: 90px;
  &:hover,
  &:visited {
    color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  }
`

const TabContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  width: 240px;
  border: 1px solid #dfdfdf;
  border-radius: 90px;
  margin-left: 43px;
  margin-top: 20px;

  ${mq.small`
    margin: 0;
  `}
`

const Tabs = ({ domain, pathname }) => {
  const { name, state } = domain
  return (
    (state !== 'Auction' || state !== 'Reveal') && (
      <TabContainer>
        <TabLink active={pathname === `/name/${name}`} to={`/name/${name}`}>
          Details
        </TabLink>
        <TabLink
          active={pathname === `/name/${name}/subdomains`}
          to={`/name/${name}/subdomains`}
        >
          Subdomains
        </TabLink>
      </TabContainer>
    )
  )
}
export default Tabs

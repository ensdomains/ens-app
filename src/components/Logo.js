import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'

import ENSLogo from '../assets/avalanche-avax-logo.png'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 30px;
  ${mq.medium`
    width: 34px
  `}
`

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  width: auto;

  ${mq.medium`
    width: 200px;
  `}
`

const Logo = ({ color, className, to = '' }) => (
  <LogoContainer className={className} to={to}>
    <IconLogo src={ENSLogo} />
    <h1 style={{ color: '#000', marginTop: '15%' }}>ANS</h1>
  </LogoContainer>
)

export default Logo

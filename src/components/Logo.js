import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'

import PulseDomainsLogo from '../assets/pulse-domains.png'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 60px;
  ${mq.medium`
    width: 84px
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
    <IconLogo src={PulseDomainsLogo} />
  </LogoContainer>
)

export default Logo

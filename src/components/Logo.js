import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'

// import ENSLogo from '../assets/ensIconLogo.svg'
import ENSLogo from '../assets/logo_single.svg'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 60px;
  ${mq.medium`
    width: 100px
  `}
`

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 0px;
  align-items: center;
  width: auto;
  background-color: transparent;

  ${mq.medium`
    width: 160px;
  `}
`

const Logo = ({ color, className, to = '' }) => (
  <LogoContainer className={className} to={to}>
    <IconLogo src={ENSLogo} />
    {/*<LogoTyped color={color} />*/}
  </LogoContainer>
)

export default Logo

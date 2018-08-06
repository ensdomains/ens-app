import React, { Fragment } from 'react'
import styled from 'react-emotion'

import ENSLogo from '../assets/ensIconLogo.svg'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 34px;
  height: 38px;
`

const LogoContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  width: 200px;
`

const Logo = ({ color, className }) => (
  <LogoContainer className={className}>
    <IconLogo src={ENSLogo} />
    <LogoTyped color={color} />
  </LogoContainer>
)

export default Logo

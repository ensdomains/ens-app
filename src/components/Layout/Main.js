import React from 'react'
import styled from '@emotion/styled/macro'

import mq from 'mediaQuery'
import { hasNonAscii } from '../../utils/utils'

const MainContainer = styled('main')`
  margin-top: 50px;

  ${p =>
    p.hasNonAscii
      ? mq.medium`
    margin-left: 200px;
    margin-top: 250px;
  `
      : mq.medium`
    margin-left: 200px;
    margin-top: 150px;
  `}
`

const Main = ({ children }) => (
  <MainContainer hasNonAscii={hasNonAscii()}>{children}</MainContainer>
)

export default Main

import React from 'react'
import styled from '@emotion/styled/macro'

import mq from 'mediaQuery'
import { hasNonAscii } from '../../utils/utils'

const MainContainer = styled('main')`
  margin-top: 50px;

  ${p =>
    p.hasNonAscii
      ? mq.medium`
      margin:250px 200px 0;
  `
      : mq.medium`
      margin:150px 200px 0;
  `}
`

const Main = ({ children }) => (
  <MainContainer hasNonAscii={hasNonAscii()}>{children}</MainContainer>
)

export default Main

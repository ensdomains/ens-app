import React from 'react'
import styled from '@emotion/styled/macro'

import mq from 'mediaQuery'

const MainContainer = styled('main')`
  margin-top: 50px;
  ${mq.medium`
    margin-left: 200px;
    margin-top: 150px;
  `}
`

const Main = ({ children }) => <MainContainer>{children}</MainContainer>

export default Main

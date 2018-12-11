import React from 'react'
import styled from 'react-emotion'

import mq from '../../mediaQuery'

const MainContainer = styled('main')`
  ${mq.small`
    margin-left: 200px;
    margin-top: 150px;
  `}
`

const Main = ({ children }) => <MainContainer>{children}</MainContainer>

export default Main

import React from 'react'
import styled from 'react-emotion'

const MainContainer = styled('main')`
  margin-left: 200px;
  margin-top: 150px;
`

const Main = ({ children }) => <MainContainer>{children}</MainContainer>

export default Main

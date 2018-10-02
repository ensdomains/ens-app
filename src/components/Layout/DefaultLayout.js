import React, { Fragment } from 'react'

import Header from '../Header/Header'
import Container from './Container'
import SideNav from '../SideNav/SideNav'
import Main from './Main'

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />
    <Container>
      <SideNav />
      <Main>{children}</Main>
    </Container>
  </Fragment>
)

export default DefaultLayout

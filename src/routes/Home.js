import React from 'react'
import Search from '../components/SearchName/Search'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SubDomainResults/SubDomainResults'
import SideNav from '../components/SideNav/SideNav'

import styled from 'react-emotion'

const Container = styled('div')`
  max-width: 1200px;
  margin: 0 auto 0;
`

export default props => (
  <Container>
    <SideNav />
    <DomainInfo />
    <SubDomainResults />
  </Container>
)

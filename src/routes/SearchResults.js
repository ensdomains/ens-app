import React from 'react'
import Search from '../components/SearchName/Search'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SubDomainResults/SubDomainResults'
import SideNav from '../components/SideNav/SideNav'

export default props => (
  <Container>
    <SideNav />
    <DomainInfo />
    <SubDomainResults />
  </Container>
)

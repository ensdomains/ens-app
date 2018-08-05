import React from 'react'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SubDomainResults/SubDomainResults'
import SideNav from '../components/SideNav/SideNav'
import Container from '../components/Container'

export default props => (
  <Container>
    <SideNav />
    <DomainInfo />
    <SubDomainResults />
  </Container>
)

import React from 'react'
import Search from '../components/SearchName/Search'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SubDomainResults/SubDomainResults'
import SideNav from '../components/SideNav/SideNav'

export default () => (
  <div>
    <SideNav />
    <DomainInfo />
    <SubDomainResults />
  </div>
)

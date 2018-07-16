import React from 'react'
import Search from '../components/SearchName/Search'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SubDomainResults/SubDomainResults'

export default () => (
  <div>
    <h2>Search a Name</h2>
    <Search />
    <DomainInfo />
    <SubDomainResults />
  </div>
)

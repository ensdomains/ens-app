import React from 'react'
import CheckAvailability from '../components/SearchName/CheckAvailability'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SearchName/SubDomainResults'

export default () => (
  <div>
    <h2>Search a Name</h2>
    <CheckAvailability />
    <DomainInfo />
    <SubDomainResults />
  </div>
)

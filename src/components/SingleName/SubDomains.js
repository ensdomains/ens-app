import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'

import { GET_SUBDOMAINS } from '../../graphql/queries'
import Loader from '../Loader'
import { H2 } from '../Typography/Basic'

const SubDomainH2 = styled(H2)`
  padding: 20px 0 50px;
  text-align: center;
  color: #ccd4da;
`

const LoaderWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
`

const SubDomains = ({ domain }) => (
  <SubDomainsContainer>
    {parseInt(domain.owner, 16) !== 0 ? (
      <Query query={GET_SUBDOMAINS} variables={{ name: domain.name }}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <LoaderWrapper>
                <Loader large />
              </LoaderWrapper>
            )
          if (data.getSubDomains.subDomains.length === 0) {
            return <SubDomainH2>No subdomains have been added.</SubDomainH2>
          }
          return data.getSubDomains.subDomains.map(d => (
            <Link to={`/name/${d}`}>{d}</Link>
          ))
        }}
      </Query>
    ) : (
      <SubDomainH2>No subdomains have been added.</SubDomainH2>
    )}
  </SubDomainsContainer>
)

const SubDomainsContainer = styled('div')``

export default SubDomains

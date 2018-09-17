import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'

import { GET_SUBDOMAINS } from '../../graphql/queries'
import Loader from '../Loader'
import { H2 } from '../Typography/Basic'
import { SingleNameBlockies } from './SingleNameBlockies'

const SubDomainsContainer = styled('div')`
  padding-bottom: 30px;
  padding-left: 40px;
  padding-right: 40px;
`

const SubDomainH2 = styled(H2)`
  padding: 20px 0 50px;
  text-align: center;
  color: #ccd4da;
`

const SubDomainLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 30px 0;
  color: #2b2b2b;
  font-size: 22px;
  font-weight: 100;
  border-bottom: 1px dashed #d3d3d3;

  &:last-child {
    border: none;
  }
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
            <SubDomainLink to={`/name/${d.name}`}>
              <SingleNameBlockies imageSize={24} address={d.owner} />
              {d.name}
            </SubDomainLink>
          ))
        }}
      </Query>
    ) : (
      <SubDomainH2>No subdomains have been added.</SubDomainH2>
    )}
  </SubDomainsContainer>
)

export default SubDomains

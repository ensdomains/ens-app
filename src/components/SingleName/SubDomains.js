import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'

import { GET_SUBDOMAINS } from '../../graphql/queries'
import Loader from '../Loader'
import { H2 } from '../Typography/Basic'
import { SingleNameBlockies } from './SingleNameBlockies'
import AddSubdomain from './AddSubdomain'

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

const SubDomains = ({ domain, isOwner, ...rest }) => (
  <SubDomainsContainer {...rest}>
    {parseInt(domain.owner, 16) !== 0 ? (
      <Query query={GET_SUBDOMAINS} variables={{ name: domain.name }}>
        {({ loading, error, data, refetch }) => {
          if (error) {
            console.log('error getting subdomains', error)
          }
          if (loading)
            return (
              <>
                {isOwner && <AddSubdomain domain={domain} refetch={refetch} />}
                <LoaderWrapper>
                  <Loader large />
                </LoaderWrapper>
              </>
            )
          if (data && data.getSubDomains.subDomains.length === 0) {
            return (
              <>
                {isOwner && <AddSubdomain domain={domain} refetch={refetch} />}
                <SubDomainH2>No subdomains have been added.</SubDomainH2>
              </>
            )
          }
          return (
            <>
              {isOwner && <AddSubdomain domain={domain} refetch={refetch} />}
              {data &&
                data.getSubDomains.subDomains.map(d => (
                  <SubDomainLink key={d.name} to={`/name/${d.name}`}>
                    <SingleNameBlockies imageSize={24} address={d.owner} />
                    {d.decrypted
                      ? d.name
                      : `${d.labelHash.slice(0, 10)}.${d.node}`}
                  </SubDomainLink>
                ))}
            </>
          )
        }}
      </Query>
    ) : (
      <SubDomainH2>No subdomains have been added.</SubDomainH2>
    )}
  </SubDomainsContainer>
)

export default SubDomains

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'
import {
  GET_SUBDOMAINS_FROM_SUBGRAPH,
  GET_SUBDOMAINS
} from '../../graphql/queries'
import Loader from '../Loader'
import { H2 } from '../Typography/Basic'
import { SingleNameBlockies } from './SingleNameBlockies'
import AddSubdomain from './AddSubdomain'
import { getNamehash, getNetworkId } from '@ensdomains/ui'

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

class SubDomains extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isTestNetwork: false
    }
  }

  async componentDidMount() {
    const networkId = await getNetworkId()
    // hack for test purposes - use subgraph only in production
    this.setState({ isTestNetwork: parseInt(networkId, 10) > 50 })
  }

  render() {
    const { domain, isOwner, ...rest } = this.props
    return (
      <SubDomainsContainer {...rest}>
        {parseInt(domain.owner, 16) !== 0 ? (
          this.state.isTestNetwork ? (
            <Query query={GET_SUBDOMAINS} variables={{ name: domain.name }}>
              {({ loading, error, data, refetch }) => {
                if (error) {
                  console.log('error getting subdomains', error)
                }
                if (loading)
                  return (
                    <>
                      {isOwner && (
                        <AddSubdomain domain={domain} refetch={refetch} />
                      )}
                      <Loader withWrap large />
                    </>
                  )
                if (data && data.getSubDomains.subDomains.length === 0) {
                  return (
                    <>
                      {isOwner && (
                        <AddSubdomain domain={domain} refetch={refetch} />
                      )}
                      <SubDomainH2>No subdomains have been added.</SubDomainH2>
                    </>
                  )
                }
                return (
                  <>
                    {isOwner && (
                      <AddSubdomain domain={domain} refetch={refetch} />
                    )}
                    {data &&
                      data.getSubDomains.subDomains.map(d => (
                        <SubDomainLink key={d.name} to={`/name/${d.name}`}>
                          <SingleNameBlockies
                            imageSize={24}
                            address={d.owner}
                          />
                          {d.decrypted
                            ? d.name
                            : `[unknown${d.labelHash.slice(2, 12)}].${d.node}`}
                        </SubDomainLink>
                      ))}
                  </>
                )
              }}
            </Query>
          ) : (
            <Query
              query={GET_SUBDOMAINS_FROM_SUBGRAPH}
              variables={{
                id: getNamehash(domain.name)
              }}
            >
              {({ loading, error, data, refetch }) => {
                if (error) {
                  console.error('Unable to get subdomains, error: ', error)
                }
                if (loading)
                  return (
                    <>
                      {isOwner && (
                        <AddSubdomain domain={domain} refetch={refetch} />
                      )}
                      <Loader withWrap large />
                    </>
                  )
                if (data && data.domain.subdomains.length === 0) {
                  return (
                    <>
                      {isOwner && (
                        <AddSubdomain domain={domain} refetch={refetch} />
                      )}
                      <SubDomainH2>No subdomains have been added.</SubDomainH2>
                    </>
                  )
                }
                return (
                  <>
                    {isOwner && (
                      <AddSubdomain domain={domain} refetch={refetch} />
                    )}
                    {data &&
                      data.domain.subdomains.map(d => {
                        const name = `${d.labelName}.${domain.name}`
                        return (
                          <SubDomainLink key={d.name} to={`/name/${name}`}>
                            <SingleNameBlockies
                              imageSize={24}
                              address={d.owner.id}
                            />
                            {d.labelName !== null
                              ? `${name}`
                              : `[unknown${d.labelhash.slice(2, 10)}].${
                                  domain.name
                                }`}
                          </SubDomainLink>
                        )
                      })}
                  </>
                )
              }}
            </Query>
          )
        ) : (
          <SubDomainH2>No subdomains have been added.</SubDomainH2>
        )}
      </SubDomainsContainer>
    )
  }
}

export default SubDomains

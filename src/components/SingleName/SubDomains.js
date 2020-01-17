import React from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'
import {
  GET_SUBDOMAINS_FROM_SUBGRAPH,
  GET_SUBDOMAINS
} from '../../graphql/queries'
import Loader from '../Loader'
import { H2 } from '../Typography/Basic'
import AddSubdomain from './AddSubdomain'
import ChildDomainItem from '../DomainItem/ChildDomainItem'
import { getNamehash } from '@ensdomains/ui'
import { decryptName } from '../../api/labels'

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

function SubDomainsFromWeb3({ domain, canAddSubdomain }) {
  return (
    <Query query={GET_SUBDOMAINS} variables={{ name: domain.name }}>
      {({ loading, error, data, refetch }) => {
        if (error) {
          console.log('error getting subdomains', error)
        }
        if (loading)
          return (
            <>
              <AddSubdomainContainer
                domain={domain}
                refetch={refetch}
                canAddSubdomain={canAddSubdomain}
              />
              <Loader withWrap large />
            </>
          )
        if (
          data &&
          data.getSubDomains &&
          data.getSubDomains.subDomains &&
          data.getSubDomains.subDomains.length === 0
        ) {
          return (
            <>
              <AddSubdomainContainer
                domain={domain}
                refetch={refetch}
                canAddSubdomain={canAddSubdomain}
              />
              <SubDomainH2>No subdomains have been added.</SubDomainH2>
            </>
          )
        }
        return (
          <>
            <AddSubdomainContainer
              domain={domain}
              refetch={refetch}
              canAddSubdomain={canAddSubdomain}
            />
            {data &&
              data.getSubDomains &&
              data.getSubDomains.subDomains &&
              data.getSubDomains.subDomains.map(d => (
                <ChildDomainItem
                  name={d.name}
                  owner={d.owner}
                  parent={d.parent}
                  labelhash={d.labelHash}
                />
              ))}
          </>
        )
      }}
    </Query>
  )
}

function AddSubdomainContainer({ domain, refetch, canAddSubdomain }) {
  return canAddSubdomain ? (
    <AddSubdomain domain={domain} refetch={refetch} />
  ) : null
}

function SubDomains({
  domain,
  isOwner,
  loadingIsParentMigrated,
  isParentMigratedToNewRegistry,
  ...rest
}) {
  const canAddSubdomain =
    isOwner && !loadingIsParentMigrated && isParentMigratedToNewRegistry
  console.log(isOwner, !loadingIsParentMigrated, isParentMigratedToNewRegistry)
  return (
    <SubDomainsContainer {...rest}>
      {parseInt(domain.owner, 16) !== 0 ? (
        <Query
          query={GET_SUBDOMAINS_FROM_SUBGRAPH}
          variables={{
            id: getNamehash(domain.name)
          }}
        >
          {({ loading, error, data, refetch }) => {
            if (error || !data.domain) {
              console.error(
                'Unable to get subdomains from subgraph, falling back to web3 ',
                error
              )

              return (
                <SubDomainsFromWeb3
                  domain={domain}
                  isOwner={isOwner}
                  canAddSubdomain={canAddSubdomain}
                />
              )
            }
            if (loading)
              return (
                <>
                  <Loader withWrap large />
                </>
              )
            if (
              data &&
              data.domain &&
              data.domain.subdomains &&
              data.domain.subdomains.length === 0
            ) {
              return (
                <>
                  <AddSubdomainContainer
                    domain={domain}
                    refetch={refetch}
                    canAddSubdomain={canAddSubdomain}
                  />
                  <SubDomainH2>No subdomains have been added.</SubDomainH2>
                </>
              )
            }

            if (data.domain === null) {
              return (
                <SubDomainsFromWeb3
                  domain={domain}
                  isOwner={isOwner}
                  canAddSubdomain={canAddSubdomain}
                />
              )
            }
            return (
              <>
                <AddSubdomainContainer
                  domain={domain}
                  refetch={refetch}
                  canAddSubdomain={canAddSubdomain}
                />
                {data &&
                  data.domain &&
                  data.domain.subdomains &&
                  data.domain.subdomains.map(d => {
                    let name
                    if (d.labelName !== null) {
                      name = `${d.labelName}.${domain.name}`
                    } else {
                      name = `${decryptName(d.labelhash)}.${domain.name}`
                    }
                    return (
                      <ChildDomainItem
                        name={name}
                        owner={d.owner.id}
                        parent={domain.name}
                        labelhash={d.labelHash}
                      />
                    )
                  })}
              </>
            )
          }}
        </Query>
      ) : (
        <SubDomainH2>No subdomains have been added.</SubDomainH2>
      )}
    </SubDomainsContainer>
  )
}

export default SubDomains

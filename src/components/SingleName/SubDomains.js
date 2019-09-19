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
import { getNamehash, encodeLabelhash } from '@ensdomains/ui'

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

function SubDomainsFromWeb3({ domain, isOwner }) {
  return (
    <Query query={GET_SUBDOMAINS} variables={{ name: domain.name }}>
      {({ loading, error, data, refetch }) => {
        if (error) {
          console.log('error getting subdomains', error)
        }
        if (loading)
          return (
            <>
              {isOwner && <AddSubdomain domain={domain} refetch={refetch} />}
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

function SubDomains({ domain, isOwner, ...rest }) {
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
            if (error) {
              console.error('Unable to get subdomains, error: ', error)

              return <SubDomainsFromWeb3 domain={domain} isOwner={isOwner} />
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
            if (
              data &&
              data.domain &&
              data.domain.subdomains &&
              data.domain.subdomains.length === 0
            ) {
              return (
                <>
                  {isOwner && (
                    <AddSubdomain domain={domain} refetch={refetch} />
                  )}
                  <SubDomainH2>No subdomains have been added.</SubDomainH2>
                </>
              )
            }

            if (data.domain === null) {
              return <SubDomainsFromWeb3 domain={domain} isOwner={isOwner} />
            }
            return (
              <>
                {isOwner && <AddSubdomain domain={domain} refetch={refetch} />}
                {data &&
                  data.domain.subdomains.map(d => {
                    let name
                    if (d.labelName !== null) {
                      name = `${d.labelName}.${domain.name}`
                    } else {
                      name = `${encodeLabelhash(d.labelhash)}.${domain.name}`
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

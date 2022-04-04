import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { Query } from '@apollo/client/react/components'
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
        const subdomains =
          data &&
          data.getSubDomains &&
          data.getSubDomains.subDomains &&
          data.getSubDomains.subDomains.filter(subdomain => {
            return parseInt(subdomain.owner, 16) !== 0
          })
        const hasNoSubdomains = subdomains && subdomains.length === 0
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
        if (hasNoSubdomains) {
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
            {subdomains &&
              subdomains.map(d => (
                <ChildDomainItem
                  name={d.name}
                  owner={d.owner}
                  labelhash={d.labelHash}
                  canDeleteSubdomain={canAddSubdomain}
                  refetch={refetch}
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
  isMigratedToNewRegistry,
  loadingIsMigrated,
  readOnly = false,
  ...rest
}) {
  const { t } = useTranslation()
  const canAddSubdomain =
    !readOnly &&
    isOwner &&
    !loadingIsParentMigrated &&
    !loadingIsMigrated &&
    isParentMigratedToNewRegistry &&
    isMigratedToNewRegistry

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
            const subdomains =
              data &&
              data.domain &&
              data.domain.subdomains &&
              data.domain.subdomains.filter(subdomain => {
                return parseInt(subdomain.owner.id, 16) !== 0
              })

            if (error || !data || !data.domain) {
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
            if (subdomains && subdomains.length === 0) {
              return (
                <>
                  <AddSubdomainContainer
                    domain={domain}
                    refetch={refetch}
                    canAddSubdomain={canAddSubdomain}
                  />
                  <SubDomainH2>
                    {t('singleName.subdomains.nosubdomains')}
                  </SubDomainH2>
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
                {subdomains.map(d => {
                  let name, parentLabel
                  if (domain.name === '[root]') {
                    parentLabel = ''
                  } else {
                    parentLabel = `.${domain.name}`
                  }
                  if (d.labelName !== null) {
                    name = `${d.labelName}${parentLabel}`
                  } else {
                    name = `${decryptName(d.labelhash)}${parentLabel}`
                  }
                  return (
                    <ChildDomainItem
                      showBlockies={true}
                      name={name}
                      isMigrated={d.isMigrated}
                      owner={d.owner.id}
                      labelhash={d.labelHash}
                      isSubdomain={true}
                      canDeleteSubdomain={canAddSubdomain}
                      refetch={refetch}
                    />
                  )
                })}
              </>
            )
          }}
        </Query>
      ) : (
        <SubDomainH2>{t('singleName.subdomains.nosubdomains')}</SubDomainH2>
      )}
    </SubDomainsContainer>
  )
}

export default SubDomains

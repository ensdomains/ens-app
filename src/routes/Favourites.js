import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'
import DomainItem from '../components/DomainItem/DomainItem'
import {
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES,
  GET_OWNER
} from '../graphql/queries'

import mq from 'mediaQuery'

import { H2 as DefaultH2 } from '../components/Typography/Basic'
import LargeHeart from '../components/Icons/LargeHeart'

const NoDomainsContainer = styled('div')`
  display: flex;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
  margin-bottom: 40px;

  h2 {
    color: #adbbcd;
    font-weight: 100;
    margin-bottom: 0;
    padding: 0;
    margin-top: 20px;
    text-align: center;
    max-width: 500px;
  }

  p {
    color: #2b2b2b;
    font-size: 18px;
    font-weight: 300;
    margin-top: 20px;
    line-height: 1.3em;
    text-align: center;
    max-width: 400px;
  }
`

const H2 = styled(DefaultH2)`
  margin-top: 50px;
  margin-left: 20px;
  ${mq.medium`
    margin-left: 0;
  `}
`

const NoDomains = ({ type }) => {
  const { t } = useTranslation()
  return (
    <NoDomainsContainer>
      <LargeHeart />
      <h2>
        {type === 'domain'
          ? t('favourites.nofavouritesDomains.title')
          : t('favourites.nofavouritesSubdomains.title')}
      </h2>
      <p>
        {type === 'domain'
          ? t('favourites.nofavouritesDomains.text')
          : t('favourites.nofavouritesSubdomains.text')}
      </p>
    </NoDomainsContainer>
  )
}

function getDomainState(owner) {
  return parseInt(owner, 16) === 0 ? 'Open' : 'Owned'
}

function Favourites() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = 'ENS Favourites'
  }, [])
  return (
    <FavouritesContainer data-testid="favourites-container">
      <H2>{t('favourites.favouriteTitle')}</H2>
      <Query query={GET_FAVOURITES}>
        {({ data }) => {
          if (data.favourites.length === 0) {
            return <NoDomains type="domain" />
          }
          return (
            <>
              {data.favourites.map(domain => (
                <Query
                  query={GET_OWNER}
                  variables={{ name: domain.name }}
                  key={domain.name}
                >
                  {({ loading, error, data }) => {
                    if (error)
                      return (
                        <div>{(console.log(error), JSON.stringify(error))}</div>
                      )
                    return (
                      <DomainItem
                        loading={loading}
                        domain={{
                          ...domain,
                          state: getDomainState(data.getOwner),
                          owner: data.getOwner
                        }}
                        isFavourite={true}
                      />
                    )
                  }}
                </Query>
              ))}
            </>
          )
        }}
      </Query>
      <H2>{t('favourites.subdomainFavouriteTitle')}</H2>
      <Query query={GET_SUBDOMAIN_FAVOURITES}>
        {({ data }) => {
          if (data.subDomainFavourites.length === 0) {
            return (
              <NoDomains type="subDomainName">
                <LargeHeart />
                <h2>{t('favourites.nofavouritesSubdomains.title')}</h2>
                <p>{t('favourites.nofavouritesSubdomains.text')}</p>
              </NoDomains>
            )
          }
          return (
            <>
              {data.subDomainFavourites.map(domain => (
                <Query
                  query={GET_OWNER}
                  variables={{ name: domain.name }}
                  key={domain.name}
                >
                  {({ loading, error, data }) => {
                    if (error)
                      return (
                        <div>{(console.log(error), JSON.stringify(error))}</div>
                      )
                    return (
                      <DomainItem
                        loading={loading}
                        domain={{
                          ...domain,
                          state: getDomainState(data.getOwner),
                          owner: data.getOwner
                        }}
                        isSubDomain={true}
                        isFavourite={true}
                      />
                    )
                  }}
                </Query>
              ))}
            </>
          )
        }}
      </Query>
    </FavouritesContainer>
  )
}

const FavouritesContainer = styled('div')`
  padding-bottom: 60px;
`

export default Favourites

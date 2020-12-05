import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { Query } from 'react-apollo'
import DomainItem from '../components/DomainItem/DomainItem'
import { getNamehash } from '@ensdomains/ui'
import { useQuery } from 'react-apollo'
import {
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES,
  GET_OWNER,
  GET_REGISTRATIONS_BY_IDS_SUBGRAPH
} from '../graphql/queries'

import mq from 'mediaQuery'
import moment from 'moment'

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

const NoDomains = () => {
  const { t } = useTranslation()
  return (
    <NoDomainsContainer>
      <LargeHeart />
      <h2>{t('favourites.nofavouritesDomains.title')}</h2>
      <p>{t('favourites.nofavouritesDomains.text')}</p>
    </NoDomainsContainer>
  )
}

function getAvailable(expiryDate) {
  let e = moment(parseInt(expiryDate * 1000))
  let e2 = moment().subtract(90, 'days')
  return e2.diff(e) > 0
}

function getDomainState(owner, available) {
  if (!owner || available) return 'Open'
  return parseInt(owner, 16) === 0 ? 'Open' : 'Owned'
}

function Favourites() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = 'ENS Favourites'
  }, [])
  const { data: { favourites } = [] } = useQuery(GET_FAVOURITES)
  const { data: { subDomainFavourites } = [] } = useQuery(
    GET_SUBDOMAIN_FAVOURITES
  )
  const ids = favourites && favourites.map(f => getNamehash(f.name))
  const { data: { registrations } = [] } = useQuery(
    GET_REGISTRATIONS_BY_IDS_SUBGRAPH,
    {
      variables: { ids }
    }
  )

  if (!favourites || (favourites.length === 0 && !registrations)) {
    return <NoDomains />
  }
  let favouritesList = []
  if (favourites.length > 0) {
    if (registrations && registrations.length === favourites.length) {
      favouritesList = registrations.map(r => {
        return {
          name: r.domain.name,
          owner: r.domain.owner.id,
          available: getAvailable(r && r.expiryDate),
          expiryDate: r.expiryDate
        }
      })
    } else if (registrations && registrations.length > 0) {
      // Fallback when subgraph is not returning result
      favouritesList = favourites.map(f => {
        let r = registrations.filter(a => a.domain.name === f.name)[0]
        return {
          name: f.name,
          owner: r && r.domain.owner.id,
          available: getAvailable(r && r.expiryDate),
          expiryDate: r && r.expiryDate
        }
      })
    } else {
      // Fallback when subgraph is not returning result
      favouritesList = favourites.map(f => {
        return {
          name: f.name
        }
      })
    }
  }

  const hasFavourites =
    (favouritesList && favouritesList.length > 0) ||
    (subDomainFavourites && subDomainFavourites.length > 0)
  if (!hasFavourites) {
    return (
      <FavouritesContainer data-testid="favourites-container">
        <H2>{t('favourites.favouriteTitle')}</H2>
        <NoDomains>
          <LargeHeart />
          <h2>{t('favourites.nofavouritesDomains.title')}</h2>
          <p>{t('favourites.nofavouritesDomains.text')}</p>
        </NoDomains>
      </FavouritesContainer>
    )
  }

  return (
    <FavouritesContainer data-testid="favourites-container">
      <H2>{t('favourites.favouriteTitle')}</H2>
      {favouritesList &&
        favouritesList.map(domain => {
          return (
            <DomainItem
              domain={{
                ...domain,
                state: getDomainState(domain.owner, domain.available),
                owner: domain.owner
              }}
              isFavourite={true}
            />
          )
        })}
      {subDomainFavourites &&
        subDomainFavourites.map(domain => (
          <Query
            query={GET_OWNER}
            variables={{ name: domain.name }}
            key={domain.name}
          >
            {({ loading, error, data }) => {
              if (error)
                return <div>{(console.log(error), JSON.stringify(error))}</div>
              return (
                <DomainItem
                  loading={loading}
                  domain={{
                    ...domain,
                    state: getDomainState(data?.getOwner, false),
                    owner: data?.getOwner
                  }}
                  isSubDomain={true}
                  isFavourite={true}
                />
              )
            }}
          </Query>
        ))}
    </FavouritesContainer>
  )
}

const FavouritesContainer = styled('div')`
  padding-bottom: 60px;
`

export default Favourites

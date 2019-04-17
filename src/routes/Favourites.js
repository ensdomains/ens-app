import React, { Component, Fragment } from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'
import DomainItem from '../components/DomainItem/DomainItem'
import {
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES,
  GET_SINGLE_NAME
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

const NoDomains = ({ type }) => (
  <NoDomainsContainer>
    <LargeHeart />
    <h2>
      No {type === 'domain' ? 'names' : 'sub domain names'} have been saved.
    </h2>
    <p>
      To add names to favourites, click the heart icon next to any desired name.
    </p>
  </NoDomainsContainer>
)

class Favourites extends Component {
  state = {
    hasFavourites: true,
    hasSubDomainFavourites: true
  }
  componentDidMount() {
    document.title = 'ENS Favourites'
  }
  render() {
    const { hasFavourites, hasSubDomainFavourites } = this.state
    return (
      <FavouritesContainer data-testid="favourites-container">
        <H2>Favourite Top Level Domains</H2>
        <Query query={GET_FAVOURITES}>
          {({ data }) => {
            if (data.favourites.length === 0) {
              return <NoDomains type="domain" />
            }
            return (
              <>
                {data.favourites.map(domain => (
                  <Query
                    query={GET_SINGLE_NAME}
                    variables={{ name: domain.name }}
                    key={domain.name}
                  >
                    {({ loading, error, data }) => {
                      if (error)
                        return (
                          <div>
                            {(console.log(error), JSON.stringify(error))}
                          </div>
                        )
                      return (
                        <DomainItem
                          loading={loading}
                          domain={data.singleName}
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
        <H2>Favourite Sub Domains</H2>
        <Query query={GET_SUBDOMAIN_FAVOURITES}>
          {({ data }) => {
            if (data.subDomainFavourites.length === 0) {
              return (
                <NoDomains type="subDomainName">
                  <LargeHeart />
                  <h2>No Sub Domain names have been saved.</h2>
                  <p>
                    To add names to favourites, click the heart icon next to any
                    desired name.
                  </p>
                </NoDomains>
              )
            }
            return (
              <Fragment>
                {data.subDomainFavourites.map(domain => (
                  <Query
                    query={GET_SINGLE_NAME}
                    variables={{ name: domain.name }}
                    key={domain.name}
                  >
                    {({ loading, error, data }) => {
                      if (error)
                        return (
                          <div>
                            {(console.log(error), JSON.stringify(error))}
                          </div>
                        )
                      return (
                        <DomainItem
                          loading={loading}
                          domain={data.singleName}
                          isSubDomain={true}
                          isFavourite={true}
                        />
                      )
                    }}
                  </Query>
                ))}
              </Fragment>
            )
          }}
        </Query>
        {!hasFavourites && !hasSubDomainFavourites && (
          <div>No SubdominsFavourites</div>
        )}
      </FavouritesContainer>
    )
  }
}

const FavouritesContainer = styled('div')`
  padding-bottom: 60px;
`

export default Favourites

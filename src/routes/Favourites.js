import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import DomainItem from '../components/DomainItem/DomainItem'
import { GET_FAVOURITES, GET_SUBDOMAIN_FAVOURITES } from '../graphql/queries'

import { H2 } from '../components/Typography/Basic'

class Favourites extends Component {
  render() {
    return (
      <FavouritesContainer>
        <H2>Favourite Top Level Domains</H2>
        <Query query={GET_FAVOURITES}>
          {({ data }) => (
            <Fragment>
              {data.favourites.map(domain => (
                <DomainItem
                  key={domain.name}
                  domain={domain}
                  isFavourite={true}
                />
              ))}
            </Fragment>
          )}
        </Query>
        <H2>Favourite Sub Domains</H2>
        <Query query={GET_SUBDOMAIN_FAVOURITES}>
          {({ data }) => (
            <Fragment>
              {console.log(data)}
              {data.subDomainFavourites.map(domain => (
                <DomainItem
                  key={domain.name}
                  domain={domain}
                  isSubDomain={true}
                  isFavourite={true}
                />
              ))}
            </Fragment>
          )}
        </Query>
      </FavouritesContainer>
    )
  }
}

const FavouritesContainer = styled('div')``

export default Favourites

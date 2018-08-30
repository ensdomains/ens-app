import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { SubDomainsContainer as SubDomains } from '../components/SubDomainResults/SubDomainResults'
import DomainItem from '../components/DomainItem/DomainItem'
import { GET_FAVOURITES, GET_SUBDOMAIN_FAVOURITES } from '../graphql/queries'

class Favourites extends Component {
  render() {
    return (
      <FavouritesContainer>
        Favourites
        <Query query={GET_FAVOURITES}>
          {({ data }) => (
            <Fragment>
              {data.favourites.map(domain => (
                <DomainItem domain={domain} />
              ))}
            </Fragment>
          )}
        </Query>
        <Query query={GET_SUBDOMAIN_FAVOURITES}>
          {({ data }) => (
            <Fragment>
              {console.log(data)}
              {data.subDomainFavourites.map(domain => (
                <DomainItem domain={domain} isSubDomain={true} />
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

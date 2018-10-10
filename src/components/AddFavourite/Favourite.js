import React from 'react'
import { GET_FAVOURITES, GET_SUBDOMAIN_FAVOURITES } from '../../graphql/queries'
import { Query } from 'react-apollo'
import AddFavourite from './AddFavourite'

const getFavouritesQuery = nameArray =>
  nameArray.length < 3 ? GET_FAVOURITES : GET_SUBDOMAIN_FAVOURITES

class Favourite extends React.Component {
  isFavourite(favourites, name) {
    return favourites.filter(domain => name === domain.name).length > 0
  }

  render() {
    const { domain } = this.props
    const { name } = domain
    const nameArray = name.split('.')
    return (
      <Query query={getFavouritesQuery(nameArray)}>
        {({ data, loading, error }) => {
          if (loading) return null
          if (error) {
            console.log(error)
          }
          const favourites =
            nameArray.length < 3 ? data.favourites : data.subDomainFavourites

          return (
            <AddFavourite
              domain={domain}
              isSubDomain={nameArray.length > 2}
              isFavourite={this.isFavourite(favourites, name)}
            />
          )
        }}
      </Query>
    )
  }
}

export default Favourite

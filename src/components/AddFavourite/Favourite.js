import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_FAVOURITES, GET_SUBDOMAIN_FAVOURITES } from '../../graphql/queries'
import AddFavourite from './AddFavourite'

const getFavouritesQuery = nameArray =>
  nameArray?.length < 3 ? GET_FAVOURITES : GET_SUBDOMAIN_FAVOURITES

const isFavourite = (favourites, name) => {
  return favourites?.filter(domain => name === domain.name).length > 0
}

const Favourite = ({ domain }) => {
  const { name } = domain
  const nameArray = name?.split('.')
  const { data } = useQuery(getFavouritesQuery(nameArray))

  const favourites =
    nameArray?.length < 3 ? data?.favourites : data?.subDomainFavourites

  return (
    <AddFavourite
      domain={domain}
      isSubDomain={nameArray?.length > 2}
      isFavourite={isFavourite(favourites, name)}
    />
  )
}

export default Favourite

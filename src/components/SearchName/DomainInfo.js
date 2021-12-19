import React from 'react'
import { Query } from '@apollo/client/react/components'
import { useQuery } from '@apollo/client'
import DomainItem from '../DomainItem/DomainItem'
import { GET_FAVOURITES, GET_SINGLE_NAME } from '../../graphql/queries'

export const DomainInfo = ({ domainState, isFavourite, loading }) => {
  return (
    <DomainItem
      loading={loading}
      domain={domainState}
      isFavourite={isFavourite}
    />
  )
}

//TODO: create a file for shared client queries

const DomainItemContainer = ({ singleName, searchTerm }) => {
  const {
    data: { favourites },
    loading
  } = useQuery(GET_FAVOURITES, {
    name: searchTerm
  })

  return (
    <DomainItem
      loading={loading}
      domain={singleName}
      isFavourite={
        singleName &&
        favourites &&
        favourites.filter(domain => domain.name === singleName.name).length > 0
      }
    />
  )
}

const DomainInfoContainer = ({ searchTerm }) => {
  const { data, loading, error } = useQuery(GET_SINGLE_NAME, {
    variables: {
      name: searchTerm
    }
  })

  if (loading || !data) return null
  if (error) {
    console.error(error)
    return null
  }
  const { singleName } = data

  return <DomainItemContainer {...{ singleName, searchTerm }} />
}

export default DomainInfoContainer

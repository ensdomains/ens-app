import React from 'react'
import styled from '@emotion/styled/macro'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import {
  addFavouriteMutation,
  deleteFavouriteMutation,
  addSubDomainFavouriteMutation,
  deleteSubDomainFavouriteMutation
} from '../../apollo/mutations/mutations'

import InActiveHeartDefault from '../Icons/InActiveHeart'
import ActiveHeartDefault from '../Icons/ActiveHeart'

const ActiveHeart = styled(ActiveHeartDefault)`
  &:hover {
    cursor: pointer;
  }
`

const InActiveHeart = styled(InActiveHeartDefault)`
  &:hover {
    cursor: pointer;
  }
`

const ADD_FAVOURITE = gql`
  mutation AddFavouriteMutation($domain: Domain) {
    addFavourite(domain: $domain) @client
  }
`
const ADD_SUBDOMAIN_FAVOURITE = gql`
  mutation AddSubDomainFavourite($domain: Domain) {
    addSubDomainFavourite(domain: $domain) @client
  }
`

const DELETE_FAVOURITE = gql`
  mutation DeleteFavouriteMutation($domain: Domain) {
    deleteFavourite(domain: $domain) @client
  }
`
const DELETE_SUBDOMAIN_FAVOURITE = gql`
  mutation DeleteSubDomainFavourite($domain: Domain) {
    deleteSubDomainFavourite(domain: $domain) @client
  }
`

const AddFavourite = ({ domain, isFavourite, isSubDomain }) => {
  const [subDomainFavouriteMutation] = useMutation(
    isFavourite ? DELETE_SUBDOMAIN_FAVOURITE : ADD_SUBDOMAIN_FAVOURITE,
    {
      variables: {
        domain: {
          name: domain.name
        }
      }
    }
  )

  const [favouriteMutation] = useMutation(
    isFavourite ? DELETE_FAVOURITE : ADD_FAVOURITE,
    {
      variables: {
        domain: {
          name: domain.name
        }
      }
    }
  )

  if (isSubDomain) {
    return (
      <AddFavouriteContainer
        data-testid="add-favorite"
        onClick={e => {
          e.preventDefault()
          isFavourite
            ? deleteSubDomainFavouriteMutation(domain)
            : addSubDomainFavouriteMutation(domain)
          subDomainFavouriteMutation()
        }}
      >
        {isFavourite ? <ActiveHeart /> : <InActiveHeart />}
      </AddFavouriteContainer>
    )
  }

  return (
    <AddFavouriteContainer
      data-testid="add-favorite"
      onClick={e => {
        e.preventDefault()
        isFavourite
          ? deleteFavouriteMutation(domain)
          : addFavouriteMutation(domain)
        favouriteMutation()
      }}
    >
      {isFavourite ? <ActiveHeart /> : <InActiveHeart />}
    </AddFavouriteContainer>
  )
}

const AddFavouriteContainer = styled('div')`
  padding: 5px;
`

export default AddFavourite

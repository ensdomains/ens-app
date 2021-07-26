import React from 'react'
import styled from '@emotion/styled/macro'

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

const AddFavourite = ({ domain, isFavourite, isSubDomain }) => {
  if (isSubDomain) {
    return (
      <AddFavouriteContainer
        data-testid="add-favorite"
        onClick={e => {
          e.preventDefault()
          isFavourite
            ? deleteSubDomainFavouriteMutation(domain)
            : addSubDomainFavouriteMutation(domain)
          favouriteMutation()
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

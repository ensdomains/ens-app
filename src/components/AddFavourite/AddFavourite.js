import React, { Component } from 'react'
import styled from '@emotion/styled/macro'

import InActiveHeartDefault from '../Icons/InActiveHeart'
import ActiveHeartDefault from '../Icons/ActiveHeart'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

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

class AddFavourite extends Component {
  render() {
    const { domain } = this.props
    if (this.props.isSubDomain) {
      return (
        <Mutation
          mutation={
            this.props.isFavourite
              ? DELETE_SUBDOMAIN_FAVOURITE
              : ADD_SUBDOMAIN_FAVOURITE
          }
          variables={{
            domain: {
              name: domain.name
            }
          }}
        >
          {favouriteMutation => (
            <AddFavouriteContainer
              data-testid="add-favorite"
              onClick={e => {
                e.preventDefault()
                favouriteMutation()
              }}
            >
              {this.props.isFavourite ? <ActiveHeart /> : <InActiveHeart />}
            </AddFavouriteContainer>
          )}
        </Mutation>
      )
    }

    return (
      <Mutation
        mutation={this.props.isFavourite ? DELETE_FAVOURITE : ADD_FAVOURITE}
        variables={{
          domain: {
            name: domain.name
          }
        }}
      >
        {favouriteMutation => (
          <AddFavouriteContainer
            data-testid="add-favorite"
            onClick={e => {
              e.preventDefault()
              favouriteMutation()
            }}
          >
            {this.props.isFavourite ? <ActiveHeart /> : <InActiveHeart />}
          </AddFavouriteContainer>
        )}
      </Mutation>
    )
  }
}

const AddFavouriteContainer = styled('div')`
  padding: 5px;
`

export default AddFavourite

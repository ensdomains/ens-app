import React, { Component } from 'react'
import styled from 'react-emotion'
import InActiveHeartDefault from '../Icons/InActiveHeart'
import ActiveHeartDefault from '../Icons/ActiveHeart'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const ActiveHeart = styled(ActiveHeartDefault)`
  margin-right: 20px;

  &:hover {
    cursor: pointer;
  }
`

const InActiveHeart = styled(InActiveHeartDefault)`
  margin-right: 20px;

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

class AddFavourite extends Component {
  render() {
    if (this.props.isSubDomain) {
      return (
        <Mutation
          mutation={ADD_SUBDOMAIN_FAVOURITE}
          variables={{ domain: this.props.domain }}
        >
          {addFavourite => (
            <AddFavouriteContainer onClick={addFavourite}>
              {this.props.isFavourite ? <ActiveHeart /> : <InActiveHeart />}
            </AddFavouriteContainer>
          )}
        </Mutation>
      )
    }
    return (
      <Mutation
        mutation={ADD_FAVOURITE}
        variables={{ domain: this.props.domain }}
      >
        {addFavourite => (
          <AddFavouriteContainer onClick={addFavourite}>
            {this.props.isFavourite ? <ActiveHeart /> : <InActiveHeart />}
          </AddFavouriteContainer>
        )}
      </Mutation>
    )
  }
}

const AddFavouriteContainer = styled('div')``

export default AddFavourite

import React, { Component } from 'react'
import { compose, withHandlers } from 'recompose'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const GET_DOMAIN_STATE = gql`
  mutation getDomainState($name: String) {
    getDomainState(name: $name) @client {
      name
      state
    }
  }
`

const CheckAvailability = ({ getDomainState }) => {
  let input
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        getDomainState({ variables: { name: input.value } }).then(domain => {
          console.log(domain)
        })
      }}
    >
      <input ref={el => (input = el)} />
      <button type="submit">Check Availability</button>
    </form>
  )
}

const CheckAvailabilityContainer = ({ searchDomain }) => {
  return (
    <Mutation mutation={GET_DOMAIN_STATE}>
      {getDomainState => (
        //searchDomain(domain, e)
        <CheckAvailability
          getDomainState={getDomainState}
          searchDomain={searchDomain}
        />
      )}
    </Mutation>
  )
}

export { CheckAvailability }

export default compose(
  withHandlers({
    searchDomain: props => (domain, event) => {
      event.preventDefault()
      console.log('searchDomain')
    }
  })
)(CheckAvailabilityContainer)

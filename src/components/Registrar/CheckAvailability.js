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

const CheckAvailability = ({ searchDomain }) => {
  let input
  return (
    <Mutation mutation={GET_DOMAIN_STATE}>
      {getDomainState => (
        //searchDomain(domain, e)
        <form
          onSubmit={e => {
            e.preventDefault()
            getDomainState({ variables: { name: input.value } }).then(
              result => {
                console.log(result)
              }
            )
          }}
        >
          <input ref={el => (input = el)} />
          <button type="submit">Check Availability</button>
        </form>
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
)(CheckAvailability)

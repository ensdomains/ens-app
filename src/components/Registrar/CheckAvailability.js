import React, { Component } from 'react'
import { compose, withHandlers } from 'recompose'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const GET_DOMAIN_STATE = gql`
  mutation getDomainState($domain: String) {
    getDomainState(domain: $domain) @client {
      domain
      state
    }
  }
`

const CheckAvailability = ({ searchDomain }) => {
  let domain
  return (
    <Mutation mutation={GET_DOMAIN_STATE}>
      {getDomainState => (
        //searchDomain(domain, e)
        <form
          onSubmit={e => {
            e.preventDefault()
            console.log(getDomainState)
            getDomainState({ variables: { domain } })
          }}
        >
          <input ref={el => (domain = el)} />
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

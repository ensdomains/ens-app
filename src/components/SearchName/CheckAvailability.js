import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { validateName } from '../../lib/utils'
import '../../api/subDomainRegistrar'

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
        const name = input.value
        if (validateName(name)) {
          getDomainState({ variables: { name } })
        } else {
          console.log('name is too short or has punctuation')
        }
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
        <CheckAvailability
          getDomainState={getDomainState}
          searchDomain={searchDomain}
        />
      )}
    </Mutation>
  )
}

export { CheckAvailability }

export default CheckAvailabilityContainer

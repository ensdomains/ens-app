import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { validateName } from '../../lib/utils'
import '../../api/subDomainRegistrar'
import { SubDomainStateFields } from '../../graphql/fragments'
const GET_DOMAIN_STATE = gql`
  mutation getDomainAvailability($name: String) {
    getDomainAvailability(name: $name) @client {
      name
      state
    }
  }
`

const GET_SUBDOMAIN_AVAILABILITY = gql`
  mutation getSubDomainAvailability($name: String) {
    getSubDomainAvailability(name: $name) @client {
      ...SubDomainStateFields
    }
  }

  ${SubDomainStateFields}
`

const CheckAvailability = ({ getDomainState, getSubDomainAvailability }) => {
  let input
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        const name = input.value
        if (validateName(name)) {
          getDomainState({ variables: { name } })
          getSubDomainAvailability({ variables: { name } })
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
    <Mutation mutation={GET_SUBDOMAIN_AVAILABILITY}>
      {getSubDomainAvailability => (
        <Mutation mutation={GET_DOMAIN_STATE}>
          {getDomainState => (
            <CheckAvailability
              getDomainState={getDomainState}
              getSubDomainAvailability={getSubDomainAvailability}
              searchDomain={searchDomain}
            />
          )}
        </Mutation>
      )}
    </Mutation>
  )
}

export { CheckAvailability }

export default CheckAvailabilityContainer

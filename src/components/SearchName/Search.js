import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { validateName, parseSearchTerm } from '../../lib/utils'
import { addressUtils } from '@0xproject/utils'
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

class Search extends React.Component {
  handleParse = () => {
    const type = parseSearchTerm(this.input.value)

    console.log(type)
  }

  render() {
    const { getDomainState, getSubDomainAvailability } = this.props
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          const name = this.input.value
          if (validateName(name)) {
            getDomainState({ variables: { name } })
            getSubDomainAvailability({ variables: { name } })
          } else {
            console.log('name is too short or has punctuation')
          }
        }}
      >
        <input ref={el => (this.input = el)} onChange={this.handleParse} />
        <button type="submit">Check Availability</button>
      </form>
    )
  }
}

const SearchContainer = ({ searchDomain }) => {
  return (
    <Mutation mutation={GET_SUBDOMAIN_AVAILABILITY}>
      {getSubDomainAvailability => (
        <Mutation mutation={GET_DOMAIN_STATE}>
          {getDomainState => (
            <Search
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

export { Search }

export default SearchContainer

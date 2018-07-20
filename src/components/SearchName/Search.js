import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { validateName, parseSearchTerm } from '../../lib/utils'
import { addressUtils } from '@0xproject/utils'
import '../../api/subDomainRegistrar'
import { SubDomainStateFields } from '../../graphql/fragments'
import { withRouter } from 'react-router'

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
  state = {
    type: null
  }
  handleParse = () => {
    const type = parseSearchTerm(this.input.value)
    this.setState({ type })
  }

  render() {
    const { getDomainState, getSubDomainAvailability, history } = this.props
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          const searchTerm = this.input.value
          console.log('STATE', this.state.type)

          if (this.state.type === 'eth' || this.state.type === 'test') {
            history.push(`/name/${searchTerm}`)
            return
          }

          if (validateName(searchTerm)) {
            getDomainState({ variables: { name: searchTerm } })
            getSubDomainAvailability({ variables: { name: searchTerm } })
          } else {
            console.log('name is too short or has punctuation')
          }
        }}
      >
        <input ref={el => (this.input = el)} onChange={this.handleParse} />
        <button type="submit">Search</button>
      </form>
    )
  }
}

const SearchWithRouter = withRouter(Search)

const SearchContainer = ({ searchDomain }) => {
  return (
    <Mutation mutation={GET_SUBDOMAIN_AVAILABILITY}>
      {getSubDomainAvailability => (
        <Mutation mutation={GET_DOMAIN_STATE}>
          {getDomainState => (
            <SearchWithRouter
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

export { SearchWithRouter as Search }

export default SearchContainer

import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'react-emotion'
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

const SearchForm = styled('form')`
  display: flex;

  input {
    width: calc(100% - 100px);
    border: none;
    font-size: 28px;

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #ccd4da;
    }
  }

  button {
    background: #5284ff;
    color: white;
    font-size: 22px;
    font-family: Overpass;
    font-weight: 300;
    padding: 20px 0;
    height: 90px;
    width: 162px;
    border: none;
  }
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
    const {
      getDomainState,
      getSubDomainAvailability,
      history,
      className
    } = this.props
    return (
      <SearchForm
        className={className}
        onSubmit={e => {
          e.preventDefault()
          const searchTerm = this.input.value

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
        <input
          placeholder="Search names and records"
          ref={el => (this.input = el)}
          onChange={this.handleParse}
        />
        <button type="submit">Search</button>
      </SearchForm>
    )
  }
}

const SearchWithRouter = withRouter(Search)

const SearchContainer = ({ searchDomain, className }) => {
  return (
    <Mutation mutation={GET_SUBDOMAIN_AVAILABILITY}>
      {getSubDomainAvailability => (
        <Mutation mutation={GET_DOMAIN_STATE}>
          {getDomainState => (
            <SearchWithRouter
              getDomainState={getDomainState}
              getSubDomainAvailability={getSubDomainAvailability}
              searchDomain={searchDomain}
              className={className}
            />
          )}
        </Mutation>
      )}
    </Mutation>
  )
}

export { SearchWithRouter as Search }

export default SearchContainer

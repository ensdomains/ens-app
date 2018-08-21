import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'react-emotion'
import { validateName, parseSearchTerm } from '../../lib/utils'
import '../../api/subDomainRegistrar'
import { SubDomainStateFields } from '../../graphql/fragments'
import { withRouter } from 'react-router'
import searchIcon from './search.svg'
import Caret from './Caret'
import Filters from './Filters'

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
  position: relative;
  z-index: 10000;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 27px;
    height: 27px;
    background: url(${searchIcon});
  }

  input {
    padding-left: 35px;
    width: calc(100% - 243px);
    border: none;
    font-size: 28px;
    font-family: Overpass;
    font-weight: 100;

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
    padding: 20px 0;
    height: 90px;
    width: 162px;
    border: none;

    &:hover {
      cursor: pointer;
    }
  }
`

// const FilterButton = styled('div')`
//   background:
//   &:hover {
//     cursor: pointer;
//   }
// `

class Search extends React.Component {
  state = {
    type: null,
    filterOpen: false
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
      className,
      style
    } = this.props
    return (
      <SearchForm
        className={className}
        style={style}
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

            history.push(`/results`)
          } else {
            history.push(`/results`)
            console.log('name is too short or has punctuation')
          }
        }}
      >
        <input
          placeholder="Search names and addresses"
          ref={el => (this.input = el)}
          onChange={this.handleParse}
        />
        <Caret
          up={this.state.filterOpen}
          onClick={() =>
            this.setState(state => ({ filterOpen: !state.filterOpen }))
          }
        />
        <Filters show={this.state.filterOpen} />
        <button type="submit">Search</button>
      </SearchForm>
    )
  }
}

const SearchWithRouter = withRouter(Search)

const SearchContainer = ({ searchDomain, className, style }) => {
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
              style={style}
            />
          )}
        </Mutation>
      )}
    </Mutation>
  )
}

export { SearchWithRouter as Search }

export default SearchContainer

import React, { Fragment } from 'react'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SubDomainResults/SubDomainResults'
import { SubDomainStateFields } from '../graphql/fragments'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { parseSearchTerm } from '../lib/utils'
import SearchErrors from '../components/SearchErrors/SearchErrors'

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

class Results extends React.Component {
  state = {
    errors: [],
    errorType: ''
  }
  checkValidity = () => {
    const { searchTerm, getDomainState, getSubDomainAvailability } = this.props

    console.log(searchTerm)
    this.setState({
      errors: []
    })
    const type = parseSearchTerm(this.props.searchTerm)
    if (type === 'unsupported') {
      this.setState({
        errors: ['unsupported']
      })
    } else if (type === 'invalid') {
      this.setState({
        errors: ['domainMalformed']
      })
    } else if (searchTerm.length < 7) {
      console.log('short', searchTerm)
      this.setState({
        errors: ['tooShort']
      })
      getDomainState({ variables: { name: searchTerm } })
      getSubDomainAvailability({ variables: { name: searchTerm } }).then(
        value => console.log('In mutation promise', value)
      )
    } else {
      console.log('here in getDomainState')
      getDomainState({ variables: { name: searchTerm } })
      getSubDomainAvailability({ variables: { name: searchTerm } })
    }
  }
  componentDidMount() {
    this.checkValidity()
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps, this.props)
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.checkValidity()
    }
  }
  render() {
    const { searchTerm } = this.props
    if (this.state.errors[0] === 'tooShort') {
      return (
        <Fragment>
          <SearchErrors
            errors={this.state.errors}
            searchTerm={this.props.searchTerm}
          />
          {console.log('IN RESULTS', searchTerm)}
          <SubDomainResults searchTerm={searchTerm} />
        </Fragment>
      )
    } else if (this.state.errors.length > 0) {
      return (
        <SearchErrors
          errors={this.state.errors}
          searchTerm={this.props.searchTerm}
        />
      )
    }
    return (
      <Fragment>
        {console.log('IN RESULTS', searchTerm)}
        <DomainInfo searchTerm={searchTerm} />
        <SubDomainResults searchTerm={searchTerm} />
      </Fragment>
    )
  }
}

const ResultsContainer = ({ searchDomain, match }) => {
  return (
    <Mutation
      mutation={GET_SUBDOMAIN_AVAILABILITY}
      refetchQueries={['getSubDomainState']}
    >
      {getSubDomainAvailability => (
        <Mutation
          mutation={GET_DOMAIN_STATE}
          optimisticResponse={{
            __typename: 'Mutation',
            domainState: {
              __typename: 'DomainState'
            }
          }}
          refetchQueries={['getDomainState']}
        >
          {getDomainState => (
            <Results
              searchTerm={match.params.searchTerm}
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

export default ResultsContainer

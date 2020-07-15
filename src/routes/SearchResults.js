import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Trans } from 'react-i18next'

import { H2 } from '../components/Typography/Basic'
import DomainInfo from '../components/SearchName/DomainInfo'
import { SubDomainStateFields } from '../graphql/fragments'
import { validateName, parseSearchTerm } from '../utils/utils'
import SearchErrors from '../components/SearchErrors/SearchErrors'

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
    errorType: '',
    parsed: null
  }
  checkValidity = async () => {
    const { searchTerm: _searchTerm } = this.props
    let parsed, searchTerm
    this.setState({
      errors: []
    })
    if (_searchTerm.split('.').length === 1) {
      searchTerm = _searchTerm + '.eth'
    } else {
      searchTerm = _searchTerm
    }
    const type = await parseSearchTerm(searchTerm)
    if (!['unsupported', 'invalid', 'short'].includes(type)) {
      parsed = validateName(searchTerm)
      this.setState({
        parsed
      })
    }
    document.title = `ENS Search: ${searchTerm}`

    if (type === 'unsupported') {
      this.setState({
        errors: ['unsupported']
      })
    } else if (type === 'short') {
      this.setState({
        errors: ['tooShort']
      })
    } else if (type === 'invalid') {
      this.setState({
        errors: ['domainMalformed']
      })
    } else {
      //getSubDomainAvailability({ variables: { name: searchTerm } })
    }
  }
  async componentDidMount() {
    await this.checkValidity()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      await this.checkValidity()
    }
  }
  render() {
    const { searchTerm } = this.props
    if (this.state.errors[0] === 'tooShort') {
      return (
        <>
          <SearchErrors
            errors={this.state.errors}
            searchTerm={this.props.searchTerm}
          />
          {console.log('IN RESULTS', searchTerm)}
          {/* <SubDomainResults searchTerm={searchTerm} /> */}
        </>
      )
    } else if (this.state.errors.length > 0) {
      return (
        <SearchErrors
          errors={this.state.errors}
          searchTerm={this.props.searchTerm}
        />
      )
    }
    if (this.state.parsed) {
      return (
        <>
          <H2>
            <Trans i18nKey="singleName.search.title">Names</Trans>
          </H2>
          <DomainInfo searchTerm={this.state.parsed} />
          {/* <SubDomainResults searchTerm={searchTerm} /> */}
        </>
      )
    } else {
      return ''
    }
  }
}

const ResultsContainer = ({ searchDomain, match }) => {
  return (
    <Mutation
      mutation={GET_SUBDOMAIN_AVAILABILITY}
      refetchQueries={['getSubDomainState']}
    >
      {getSubDomainAvailability => (
        <Results
          searchTerm={match.params.searchTerm}
          getSubDomainAvailability={getSubDomainAvailability}
          searchDomain={searchDomain}
        />
      )}
    </Mutation>
  )
}

export default ResultsContainer

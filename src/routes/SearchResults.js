import React, { Fragment } from 'react'
import DomainInfo from '../components/SearchName/DomainInfo'
import { SubDomainStateFields } from '../graphql/fragments'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { validateName, parseSearchTerm } from '../utils/utils'
import SearchErrors from '../components/SearchErrors/SearchErrors'
import { isShortName } from '../utils/utils'

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
  checkValidity = () => {
    const { searchTerm, getSubDomainAvailability } = this.props
    let parsed
    this.setState({
      errors: []
    })
    const type = parseSearchTerm(searchTerm)

    if (!['unsupported', 'invalid'].includes(type)) {
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
    } else if (type === 'invalid') {
      this.setState({
        errors: ['domainMalformed']
      })
    } else if (isShortName(parsed || searchTerm)) {
      this.setState({
        errors: ['tooShort']
      })
      //getSubDomainAvailability({ variables: { name: searchTerm } })
    } else {
      //getSubDomainAvailability({ variables: { name: searchTerm } })
    }
  }
  componentDidMount() {
    this.checkValidity()
  }

  componentDidUpdate(prevProps) {
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
          {/* <SubDomainResults searchTerm={searchTerm} /> */}
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
    if (this.state.parsed) {
      return (
        <Fragment>
          <DomainInfo searchTerm={this.state.parsed} />
          {/* <SubDomainResults searchTerm={searchTerm} /> */}
        </Fragment>
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

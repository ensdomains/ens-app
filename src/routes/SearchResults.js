import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Trans } from 'react-i18next'

import { H2 } from '../components/Typography/Basic'
import DomainInfo from '../components/SearchName/DomainInfo'
import { SubDomainStateFields } from '../graphql/fragments'
import { validateName, parseSearchTerm } from '../utils/utils'
import SearchErrors from '../components/SearchErrors/SearchErrors'

const GET_SUBDOMAIN_AVAILABILITY = gql`
  query getSubDomainAvailability($name: String) {
    getSubDomainAvailability(name: $name) {
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
}

const RESULTS_CONTAINER = gql`
  query getResultsContainer {
    isENSReady @client
  }
`

const useCheckValidity = (_searchTerm, isENSReady) => {
  const [errors, setErrors] = useState([])
  const [parsed, setParsed] = useState(null)

  useEffect(() => {
    const checkValidity = async () => {
      let _parsed, searchTerm
      setErrors([])

      if (_searchTerm.split('.').length === 1) {
        searchTerm = _searchTerm + '.eth'
      } else {
        searchTerm = _searchTerm
      }

      const type = await parseSearchTerm(searchTerm)
      if (!['unsupported', 'invalid', 'short'].includes(type)) {
        _parsed = validateName(searchTerm)
        setParsed(_parsed)
      }
      document.title = `ENS Search: ${searchTerm}`

      if (type === 'unsupported') {
        setErrors(['unsupported'])
      } else if (type === 'short') {
        setErrors(['tooShort'])
      } else if (type === 'invalid') {
        setErrors(['domainMalformed'])
      }
    }
    if (isENSReady) {
      checkValidity()
    }
  }, [_searchTerm, isENSReady])

  return { errors, parsed }
}

const ResultsContainer = ({ searchDomain, match }) => {
  const {
    data: { isENSReady }
  } = useQuery(RESULTS_CONTAINER)
  const searchTerm = match.params.searchTerm

  const { errors, parsed } = useCheckValidity(searchTerm, isENSReady)

  if (!isENSReady) {
    return <div>Loading</div>
  }

  if (errors[0] === 'tooShort') {
    return (
      <>
        <SearchErrors errors={errors} searchTerm={searchTerm} />
        {console.log('IN RESULTS', searchTerm)}
        {/* <SubDomainResults searchTerm={searchTerm} /> */}
      </>
    )
  } else if (errors.length > 0) {
    return <SearchErrors errors={errors} searchTerm={searchTerm} />
  }
  if (parsed) {
    return (
      <>
        <H2>
          <Trans i18nKey="singleName.search.title">Names</Trans>
        </H2>
        <DomainInfo searchTerm={parsed} />
        {/* <SubDomainResults searchTerm={searchTerm} /> */}
      </>
    )
  } else {
    return ''
  }

  // return (
  //   <Results
  //     searchTerm={match.params.searchTerm}
  //     searchDomain={searchDomain}
  //   />
  //   <Mutation
  //     mutation={GET_SUBDOMAIN_AVAILABILITY}
  //     refetchQueries={['getSubDomainState']}
  //   >
  //     {getSubDomainAvailability => (
  //
  //     )}
  //   </Mutation>
  // )
}

export default ResultsContainer

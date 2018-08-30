import React, { Fragment } from 'react'
import DomainInfo from '../components/SearchName/DomainInfo'
import SubDomainResults from '../components/SubDomainResults/SubDomainResults'
import { SubDomainStateFields } from '../graphql/fragments'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

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
  componentDidMount() {
    const { searchTerm, getDomainState, getSubDomainAvailability } = this.props
    getDomainState({ variables: { name: searchTerm } })
    getSubDomainAvailability({ variables: { name: searchTerm } })
  }

  componentDidUpdate(prevProps) {
    console.log('here in componentDidUpdate')
    if (prevProps.searchTerm !== this.props.searchTerm) {
      const {
        searchTerm,
        getDomainState,
        getSubDomainAvailability
      } = this.props
      getDomainState({ variables: { name: searchTerm } })
      getSubDomainAvailability({ variables: { name: searchTerm } })
    }
  }
  render() {
    const { searchTerm } = this.props
    return (
      <Fragment>
        <DomainInfo searchTerm={searchTerm} />
        <SubDomainResults searchTerm={searchTerm} />
      </Fragment>
    )
  }
}

const ResultsContainer = ({ searchDomain, match }) => {
  return (
    <Mutation mutation={GET_SUBDOMAIN_AVAILABILITY}>
      {getSubDomainAvailability => (
        <Mutation mutation={GET_DOMAIN_STATE}>
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

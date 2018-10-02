import React, { Component } from 'react'
import { parseSearchTerm } from '../lib/utils'
import { GET_SINGLE_NAME } from '../graphql/queries'
import { Query } from 'react-apollo'
import Loader from '../components/Loader'
import SearchErrors from '../components/SearchErrors/SearchErrors'

import Name from '../components/SingleName/Name'

class SingleName extends Component {
  state = {
    valid: false
  }
  checkValidity = () => {
    const searchTerm = this.props.match.params.name
    const validity = parseSearchTerm(searchTerm)
    const valid = validity === 'supported' || validity === 'tld'

    console.log(validity)

    this.setState({ valid, validityType: validity })
  }
  componentDidMount() {
    this.checkValidity()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.checkValidity()
    }
  }
  render() {
    const {
      match: {
        params: { name: searchTerm }
      },
      location: { pathname }
    } = this.props

    if (this.state.valid) {
      return (
        <Query query={GET_SINGLE_NAME} variables={{ name: searchTerm }}>
          {({ loading, error, data }) => {
            if (loading) return <Loader large center />
            if (error)
              return <div>{(console.log(error), JSON.stringify(error))}</div>
            return (
              <div>
                <Name
                  details={data.singleName}
                  name={searchTerm}
                  pathname={pathname}
                />
              </div>
            )
          }}
        </Query>
      )
    }

    if (this.state.validityType === 'short') {
      return <SearchErrors errors={['tooShort']} searchTerm={searchTerm} />
    } else {
      return (
        <SearchErrors errors={['domainMalformed']} searchTerm={searchTerm} />
      )
    }
  }
}

export default SingleName

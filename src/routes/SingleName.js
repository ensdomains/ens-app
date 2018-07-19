import React, { Component } from 'react'
import { validateName, parseSearchTerm } from '../lib/utils'
import { GET_SINGLE_NAME } from '../graphql/queries'
import { Query } from 'react-apollo'

import Details from '../components/Manager/Details'

class SingleName extends Component {
  state = {
    valid: false
  }
  componentDidMount() {
    const searchTerm = this.props.match.params.name
    const validity = parseSearchTerm(searchTerm)
    const valid = validity === 'eth' || 'test'

    this.setState({ valid })
  }
  render() {
    const searchTerm = this.props.match.params.name
    if (this.state.valid) {
      return (
        <Query query={GET_SINGLE_NAME} variables={{ name: searchTerm }}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>
            console.log(data)
            return (
              <div>
                <Details details={data.singleName} />
              </div>
            )
          }}
        </Query>
      )
    }

    return <div>Invalid domain name {searchTerm}</div>
  }
}

export default SingleName

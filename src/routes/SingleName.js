import React, { Component } from 'react'
import { validateName, parseSearchTerm } from '../lib/utils'
import { GET_SINGLE_NODE } from '../graphql/queries'
import { Query } from 'react-apollo'

class SingleName extends Component {
  state = {
    valid: false
  }
  componentDidMount() {
    const searchTerm = this.props.match.params.name
    const validity = parseSearchTerm(searchTerm)
    const valid = validity === 'eth'

    this.setState({ valid })
  }
  render() {
    const searchTerm = this.props.match.params.name
    if (this.state.valid) {
      return (
        <Query query={GET_SINGLE_NODE} variables={{ name: searchTerm }}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>
            console.log(data)
            return (
              <div>
                Details for {searchTerm} with owner {data.singleNode.owner}
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

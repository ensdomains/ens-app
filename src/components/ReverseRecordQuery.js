import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_REVERSE_RECORD = gql`
  query getReverseRecord($address: String) @client {
    getReverseRecord(address: $address) {
      name
      address
    }
  }
`

class ReverseResolution extends Component {
  render() {
    return (
      <Query
        query={GET_REVERSE_RECORD}
        variables={{ address: this.props.address }}
      >
        {props => {
          return this.props.children(props)
        }}
      </Query>
    )
  }
}

export default ReverseResolution

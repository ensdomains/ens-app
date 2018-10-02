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
        {({ data, loading, error }) => {
          const { getReverseRecord } = data
          if (loading) return <span>{this.props.address}</span>
          if (!getReverseRecord.name) {
            return <span>{this.props.address}</span>
          }
          return <span>{getReverseRecord.name}</span>
        }}
      </Query>
    )
  }
}

export default ReverseResolution

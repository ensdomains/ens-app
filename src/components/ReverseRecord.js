import React, { Component } from 'react'
import ReverseRecordQuery from './ReverseRecordQuery'

class ReverseResolution extends Component {
  render() {
    return (
      <ReverseRecordQuery address={this.props.address}>
        {({ data, loading }) => {
          const { getReverseRecord } = data
          if (loading) return <span>{this.props.address}</span>
          if (!getReverseRecord.name) {
            return <span>{this.props.address}</span>
          }
          return <span>{getReverseRecord.name}</span>
        }}
      </ReverseRecordQuery>
    )
  }
}

export default ReverseResolution

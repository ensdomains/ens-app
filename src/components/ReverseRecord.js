import React, { Component } from 'react'
import ReverseRecordQuery from './ReverseRecordQuery'

class ReverseResolution extends Component {
  render() {
    return (
      <ReverseRecordQuery address={this.props.address}>
        {({ data, loading }) => {
          const { getReverseRecord } = data
          if (loading) return <span>{this.props.address}</span>
          if (getReverseRecord && getReverseRecord.name) {
            return <span>{getReverseRecord.name}</span>
          }else{
            return <span>{this.props.address}</span>
          }
        }}
      </ReverseRecordQuery>
    )
  }
}

export default ReverseResolution

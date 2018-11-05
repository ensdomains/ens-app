import React, { Component } from 'react'
import styled from 'react-emotion'
import ReverseRecordQuery from '../ReverseRecordQuery'

const AddReverseRecordContainer = styled('div')``

class AddReverseRecord extends Component {
  render() {
    const { account, name } = this.props
    return (
      <AddReverseRecordContainer>
        <ReverseRecordQuery address={account}>
          {({ data: { getReverseRecord }, loading }) => {
            if (loading) return 'loading'
            console.log(name, getReverseRecord.name)
            if (getReverseRecord) {
              if (name === getReverseRecord.name) {
                return `awesome you setup your reverse with ${name} already`
              } else {
                return `Reverse record is set to ${
                  getReverseRecord.name
                }, would you like to switch?`
              }
            } else {
              return `reverse not set`
            }
          }}
        </ReverseRecordQuery>
      </AddReverseRecordContainer>
    )
  }
}

export default AddReverseRecord

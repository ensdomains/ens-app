import React, { Component } from 'react'
import styled from 'react-emotion'
import ReverseRecordQuery from '../ReverseRecordQuery'
import Editable from './Editable'
import SaveCancel from './SaveCancel'

const AddReverseRecordContainer = styled('div')``
const SetReverseContainer = styled('div')``

class AddReverseRecord extends Component {
  render() {
    const { account, name } = this.props
    return (
      <AddReverseRecordContainer>
        <Editable>
          {({ editing, startEditing, stopEditing }) => (
            <ReverseRecordQuery address={account}>
              {({ data: { getReverseRecord }, loading }) => {
                if (loading) return 'loading'
                return (
                  <>
                    {getReverseRecord ? (
                      name === getReverseRecord.name ? (
                        `awesome you setup your reverse with ${name} already`
                      ) : (
                        <div onClick={editing ? stopEditing : startEditing}>
                          {`your reverse is set to ${getReverseRecord.name} 
                          already, would you like to change it?`}
                        </div>
                      )
                    ) : (
                      `reverse not set`
                    )}
                    {editing && (
                      <SetReverseContainer>
                        {account} - {name}
                        <SaveCancel />
                      </SetReverseContainer>
                    )}
                  </>
                )
              }}
            </ReverseRecordQuery>
          )}
        </Editable>
      </AddReverseRecordContainer>
    )
  }
}

export default AddReverseRecord

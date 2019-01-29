import React, { Component } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { validateRecord } from '../../utils/records'
import DetailsItemInput from './DetailsItemInput'
import Editable from './Editable'
import SaveCancel from './SaveCancel'
import Select from '../Forms/Select'
import TxPending from '../PendingTx'
import { getOldContentWarning } from './OldContentWarning'
import { SET_CONTENT, SET_OLDCONTENT, SET_ADDRESS } from '../../graphql/mutations'

const ToggleAddRecord = styled('span')`
  font-size: 22px;

  &:hover {
    cursor: pointer;
  }
`

const RecordsTitle = styled('h3')`
  /* Pointers: */
  font-family: Overpass-Bold;
  font-size: 12px;
  color: #adbbcd;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const AddRecordContainer = styled('div')`
  background: #f0f6fa;
`

const AddRecordForm = styled('form')`
  padding: 20px;
`

const Row = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`

class AddRecord extends Component {
  state = {
    selectedRecord: null
  }

  _chooseMutation(recordType, contentType) {
    switch (recordType.value) {
      case 'content':
        if(contentType === 'oldcontent'){
          return SET_OLDCONTENT
        }else{
          return SET_CONTENT
        }
      case 'address':
        return SET_ADDRESS
      default:
        throw new Error('Not a recognised record type')
    }
  }

  handleChange = selectedRecord => {
    this.setState({ selectedRecord })
    console.log(`Option selected:`, selectedRecord)
  }
  _renderEditable() {
    const { selectedRecord } = this.state
    const { domain, emptyRecords, refetch } = this.props
    return (
      <AddRecordContainer>
        <Editable>
          {({
            editing,
            startEditing,
            stopEditing,
            newValue,
            updateValue,
            updateValueDirect,
            startPending,
            setConfirmed,
            pending,
            confirmed
          }) => {
            const isValid = validateRecord({
              type:
                selectedRecord && selectedRecord.value
                  ? selectedRecord.value
                  : null,
              value: newValue,
              contentType:domain.contentType
            })
            return (
              <>
                <RecordsTitle>
                  Records
                  {emptyRecords.length > 0 ? (
                    !editing ? (
                      pending && !confirmed ? (
                        <TxPending />
                      ) : (
                        <ToggleAddRecord onClick={startEditing}>
                          +
                        </ToggleAddRecord>
                      )
                    ) : (
                      <ToggleAddRecord onClick={stopEditing}>-</ToggleAddRecord>
                    )
                  ) : null}
                </RecordsTitle>
                {editing && (
                  <AddRecordForm>
                    <Row>
                      <Select
                        selectedRecord={selectedRecord}
                        handleChange={this.handleChange}
                        placeholder="Select a record"
                        options={emptyRecords}
                      />
                      <DetailsItemInput 
                        newValue={newValue}
                        dataType={selectedRecord ? selectedRecord.value : null}
                        contentType={domain.contentType}
                        updateValue={updateValueDirect}
                        valid={isValid}
                        invalid={!isValid}
                      />
                    </Row>
                    {selectedRecord ? (
                      <Mutation
                        mutation={this._chooseMutation(selectedRecord, domain.contentType)}
                        variables={{
                          name: domain.name,
                          recordValue: newValue
                        }}
                        onCompleted={(data) => {
                          startPending(Object.values(data)[0])
                        }}
                      >
                        {mutate => (
                          <SaveCancel
                            warning={
                              getOldContentWarning(selectedRecord.value, domain.contentType)
                            }
                            isValid={isValid}
                            stopEditing={() => {
                              stopEditing()
                              this.setState({ selectedRecord: null })
                            }}
                            mutation={e => {
                              e.preventDefault()
                              mutate().then(() => {
                                refetch()
                              })
                            }}
                          />
                        )}
                      </Mutation>
                    ) : (
                      <SaveCancel stopEditing={stopEditing} disabled />
                    )}
                  </AddRecordForm>
                )}
              </>
            )
          }}
        </Editable>
      </AddRecordContainer>
    )
  }

  _renderViewOnly() {
    return (
      <AddRecordContainer>
        <RecordsTitle>Records</RecordsTitle>
      </AddRecordContainer>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? this._renderEditable() : this._renderViewOnly()
  }
}

export default AddRecord

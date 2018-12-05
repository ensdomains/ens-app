import React, { Component } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { validateRecord, selectPlaceholder } from '../../utils/records'

import Editable from './Editable'
import SaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Select from '../Forms/Select'
import TxPending from '../PendingTx'

import { SET_CONTENT, SET_ADDRESS } from '../../graphql/mutations'

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

const Input = styled(DefaultInput)`
  margin-left: 20px;
  width: 100%;
`

class AddRecord extends Component {
  state = {
    selectedRecord: null
  }

  _chooseMutation(recordType) {
    switch (recordType.value) {
      case 'content':
        return SET_CONTENT
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
              value: newValue
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
                      <Input
                        placeholder={selectPlaceholder(selectedRecord)}
                        value={newValue}
                        onChange={updateValue}
                      />
                    </Row>
                    {selectedRecord ? (
                      <Mutation
                        mutation={this._chooseMutation(selectedRecord)}
                        variables={{
                          name: domain.name,
                          recordValue: newValue
                        }}
                        onCompleted={() => {
                          // TODO fix onCompleted
                          // refetch()
                          // setConfirmed()
                        }}
                      >
                        {mutate => (
                          <SaveCancel
                            isValid={isValid}
                            stopEditing={() => {
                              stopEditing()
                              this.setState({ selectedRecord: null })
                            }}
                            mutation={e => {
                              e.preventDefault()
                              startPending()
                              mutate().then(() => {
                                refetch()
                                setConfirmed()
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

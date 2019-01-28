import React, { Component, useState } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { validateRecord, getPlaceholder } from '../../utils/records'

import { useEditable } from '../hooks'

import SaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Select from '../Forms/Select'
import PendingTx from '../PendingTx'

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

function chooseMutation(recordType) {
  switch (recordType.value) {
    case 'content':
      return SET_CONTENT
    case 'address':
      return SET_ADDRESS
    default:
      throw new Error('Not a recognised record type')
  }
}

function Editable({ domain, emptyRecords, refetch }) {
  const [selectedRecord, selectRecord] = useState(null)
  const { state, actions } = useEditable()

  const handleChange = selectedRecord => {
    selectRecord(selectedRecord)
  }

  const { editing, newValue, txHash, pending, confirmed } = state

  const {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed
  } = actions

  const isValid = validateRecord({
    type: selectedRecord && selectedRecord.value ? selectedRecord.value : null,
    value: newValue
  })
  return (
    <>
      <RecordsTitle>
        Records
        {emptyRecords.length > 0 ? (
          !editing ? (
            pending && !confirmed ? (
              <PendingTx
                txHash={txHash}
                setConfirmed={setConfirmed}
                refetch={refetch}
              />
            ) : (
              <ToggleAddRecord onClick={startEditing}>+</ToggleAddRecord>
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
              handleChange={handleChange}
              placeholder="Select a record"
              options={emptyRecords}
            />
            <Input
              placeholder={getPlaceholder(
                selectedRecord ? selectedRecord.value : null
              )}
              value={newValue}
              onChange={e => updateValue(e.target.value)}
            />
          </Row>
          {selectedRecord ? (
            <Mutation
              mutation={chooseMutation(selectedRecord)}
              variables={{
                name: domain.name,
                recordValue: newValue
              }}
              onCompleted={data => {
                startPending(Object.values(data)[0])
              }}
            >
              {mutate => (
                <SaveCancel
                  isValid={isValid}
                  stopEditing={() => {
                    stopEditing()
                    selectRecord(null)
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
}

class AddRecord extends Component {
  _renderEditable() {
    return (
      <AddRecordContainer>
        <Editable {...this.props} />
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

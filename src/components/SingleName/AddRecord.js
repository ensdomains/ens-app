import React, { Component, useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'

import { validateRecord } from '../../utils/records'
import DetailsItemInput from './DetailsItemInput'

import { useEditable } from '../hooks'

import SaveCancel from './SaveCancel'
import DefaultSelect from '../Forms/Select'
import PendingTx from '../PendingTx'

import { getOldContentWarning } from './warnings'
import {
  SET_CONTENT,
  SET_CONTENTHASH,
  SET_ADDRESS
} from '../../graphql/mutations'

const ToggleAddRecord = styled('span')`
  font-size: 22px;

  &:hover {
    cursor: pointer;
  }
`

const Select = styled(DefaultSelect)`
  margin-right: 20px;
`

const RecordsTitle = styled('h3')`
  /* Pointers: */
  font-family: Overpass;
  font-weight: 700;
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

function chooseMutation(recordType, contentType) {
  switch (recordType.value) {
    case 'content':
      if (contentType === 'oldcontent') {
        return SET_CONTENT
      } else {
        return SET_CONTENTHASH
      }
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
    value: newValue,
    contentType: domain.contentType
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
                onConfirmed={() => {
                  setConfirmed()
                  refetch()
                }}
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
            <DetailsItemInput
              newValue={newValue}
              dataType={selectedRecord ? selectedRecord.value : null}
              contentType={domain.contentType}
              updateValue={updateValue}
              valid={isValid}
              invalid={!isValid}
            />
          </Row>
          {selectedRecord ? (
            <Mutation
              mutation={chooseMutation(selectedRecord, domain.contentType)}
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
                  warningMessage={getOldContentWarning(
                    selectedRecord.value,
                    domain.contentType
                  )}
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

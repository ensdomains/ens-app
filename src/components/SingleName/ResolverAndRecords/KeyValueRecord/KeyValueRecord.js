import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import RecordLink from '../../../Links/RecordLink'
import mq from 'mediaQuery'

import {
  RecordsContent,
  RecordsItem,
  RecordsKey,
  RecordsSubKey
} from '../RecordsItem'
import RecordInput from '../../RecordInput'
import DefaultBin from '../../../Forms/Bin'
import { emptyAddress } from '../../../../utils/utils'

const Bin = styled(DefaultBin)`
  align-self: center;
  margin-left: 10px;
  margin-right: 10px;
`

const KeyValueItem = styled(RecordsItem)`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 100%;
  padding 0;
  ${mq.medium`
    flex-direction: row;
  `}

  ${p =>
    p.editing &&
    mq.medium`
    flex-direction: column;
  `}
`

const KeyValueContainer = styled('div')`
  ${p => (p.noRecords ? 'display: none' : 'display:flex')};
  flex-direction: column;
  padding: 20px;

  ${mq.xLarge`
    flex-direction: row;
    align-items: flex-start;
  `}
`

const KeyValuesList = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${mq.xLarge`
    width: calc(100% - 200px);
  `};
`

const Key = styled(RecordsKey)`
  margin-bottom: 20px;
  ${mq.small`
    margin-bottom: 20px;
  `}
`

const RecordsListItem = styled('div')`
  display: flex;
  flex-direction: column;

  ${mq.medium`
    flex-direction: row;
    margin-bottom: 20px;
  `}
`

const KeyValuesContent = styled(RecordsContent)`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  align-items: flex-start;
  overflow: hidden;
  ${p => (p.hasBeenUpdated ? 'border: solid 1px red;' : '')}
  ${mq.small`
    grid-template-columns: 150px 1fr;
  `}
`

const DeleteRecord = styled('span')`
  color: red;
`

const validate = (validator, record) => {
  const { key, value } = record
  if (validator) {
    if (value === emptyAddress || value === '') {
      return true
    } else {
      return validator(key, value)
    }
  }
  return true
}

const Editable = ({
  editing,
  domain,
  validator,
  getPlaceholder,
  setUpdatedRecords,
  recordType,
  changedRecords,
  updateRecord,
  record
}) => {
  const { key, value } = record
  const hasBeenUpdated = false
  // const hasBeenUpdated = changedRecords[recordType].find(
  //   record => record.key === textKey
  // )
  //   ? true
  //   : false

  const isValid = validate(validator, record)

  console.log('isValid: ', isValid)

  return (
    <KeyValueItem editing={editing} hasRecord={true} noBorder>
      {editing ? (
        <KeyValuesContent editing={editing}>
          <RecordsSubKey>{key}</RecordsSubKey>
          <RecordInput
            testId={`${key}-record-input`}
            hasBeenUpdated={hasBeenUpdated}
            type="text"
            isValid={isValid}
            isInvalid={!isValid}
            onChange={event => {
              updateRecord({ ...record, value: event.target.value })
            }}
            value={value === emptyAddress ? '' : value}
          />

          <Bin
            data-testid={`${key}-record-delete`}
            onClick={() => {
              updateRecord({ ...record, value: '' })
            }}
          />
        </KeyValuesContent>
      ) : (
        <KeyValuesContent>
          <RecordsSubKey>{textKey}</RecordsSubKey>
          <RecordLink textKey={textKey} value={value} />
        </KeyValuesContent>
      )}
    </KeyValueItem>
  )
}

function Record(props) {
  const {
    textKey,
    dataValue,
    validator,
    getPlaceholder,
    setHasRecord,
    hasRecord,
    canEdit,
    editing,
    setUpdatedRecords,
    recordType,
    changedRecords,
    updateRecord,
    record
  } = props

  const { key, value } = record

  useEffect(() => {
    if (value && parseInt(value, 16) !== 0 && !hasRecord) {
      setHasRecord(true)
    }
  }, [value, hasRecord, setHasRecord])

  return canEdit ? (
    <Editable
      {...props}
      validator={validator}
      getPlaceholder={getPlaceholder}
      editing={editing}
      setUpdatedRecords={setUpdatedRecords}
      changedRecords={changedRecords}
      recordType={recordType}
      {...{ updateRecord, record }}
    />
  ) : (
    <ViewOnly textKey={textKey} value={dataValue} />
  )
}

function ViewOnly({ textKey, value, remove }) {
  return (
    <RecordsListItem>
      <RecordsSubKey>{textKey}</RecordsSubKey>
      {remove ? (
        <DeleteRecord>Delete Record</DeleteRecord>
      ) : (
        <RecordLink textKey={textKey} value={value} />
      )}
    </RecordsListItem>
  )
}

function Records({
  editing,
  canEdit,
  records,
  validator,
  getPlaceholder,
  title,
  placeholderRecords,
  setUpdatedRecords,
  updatedRecords,
  changedRecords,
  recordType,
  updateRecord
}) {
  const [hasRecord, setHasRecord] = useState(false)
  return (
    <KeyValueContainer hasRecord={hasRecord}>
      <Key>{title}</Key>
      <KeyValuesList>
        {records?.map(record => {
          // if (
          //   // Value empty
          //   (value === emptyAddress || value === '') &&
          //   // Value has not been changed
          //   !changedRecords[recordType].find(record => record.key === key) &&
          //   // Value is not a placeholder
          //   !placeholderRecords.includes(key)
          // ) {
          //   return null
          // }

          return (
            <Record
              editing={editing}
              validator={validator}
              getPlaceholder={getPlaceholder}
              setHasRecord={setHasRecord}
              hasRecord={hasRecord}
              canEdit={canEdit}
              setUpdatedRecords={setUpdatedRecords}
              changedRecords={changedRecords}
              recordType={recordType}
              {...{
                updateRecord,
                record
              }}
            />
          )
        })}
      </KeyValuesList>
    </KeyValueContainer>
  )
}

export default function KeyValueRecord(props) {
  if (props.loading) return null
  return <Records {...props} />
}

export { ViewOnly, KeyValueContainer, KeyValuesList, Key }

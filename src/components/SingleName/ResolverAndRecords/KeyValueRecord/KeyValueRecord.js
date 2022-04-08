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
import { trimRecord } from '../../../../utils/records'

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

const hasChange = (changedRecords, key) => {
  return !!changedRecords.find(el => el.key === key)
}

const Editable = ({
  editing,
  domain,
  validator,
  changedRecords,
  updateRecord,
  record,
  placeholder,
  validating
}) => {
  const { key, value } = record
  const isValid = validator(record)
  const isValidating = validating(record)
  return (
    <KeyValueItem editing={editing} hasRecord={true} noBorder>
      {editing ? (
        <KeyValuesContent editing={editing}>
          <RecordsSubKey>{key}</RecordsSubKey>
          <RecordInput
            testId={`${key}-record-input`}
            hasBeenUpdated={hasChange(changedRecords, key)}
            type="text"
            isInvalid={!isValid && !isValidating}
            onChange={event => {
              updateRecord({
                ...record,
                value: trimRecord(key, event.target.value)
              })
            }}
            value={value === emptyAddress ? '' : value}
            isValid={isValid && !isValidating}
            {...{ placeholder }}
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
          <RecordsSubKey>{key}</RecordsSubKey>
          <RecordLink textKey={key} value={value} name={domain?.name} />
        </KeyValuesContent>
      )}
    </KeyValueItem>
  )
}

function Record(props) {
  const {
    validator,
    setHasRecord,
    hasRecord,
    canEdit,
    editing,
    setUpdatedRecords,
    recordType,
    changedRecords,
    updateRecord,
    record,
    domain,
    validating
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
      validating={validating}
      editing={editing}
      setUpdatedRecords={setUpdatedRecords}
      changedRecords={changedRecords}
      recordType={recordType}
      domain={domain}
      {...{ updateRecord, record }}
    />
  ) : (
    <ViewOnly textKey={key} value={record?.value} domain={domain} />
  )
}

function ViewOnly({ textKey, value, remove, domain }) {
  return (
    <RecordsListItem>
      <RecordsSubKey>{textKey}</RecordsSubKey>
      {remove ? (
        <DeleteRecord>Delete Record</DeleteRecord>
      ) : (
        <RecordLink textKey={textKey} value={value} name={domain?.name} />
      )}
    </RecordsListItem>
  )
}

function Records({
  editing,
  canEdit,
  records,
  validator,
  title,
  setUpdatedRecords,
  changedRecords,
  recordType,
  updateRecord,
  domain,
  validating
}) {
  const [hasRecord, setHasRecord] = useState(false)
  return (
    <KeyValueContainer hasRecord={hasRecord}>
      <Key>{title}</Key>
      <KeyValuesList>
        {records?.map(record => {
          return (
            <Record
              key={record.key}
              editing={editing}
              dataValue={record.value}
              validator={validator}
              validating={validating}
              setHasRecord={setHasRecord}
              hasRecord={hasRecord}
              canEdit={canEdit}
              setUpdatedRecords={setUpdatedRecords}
              changedRecords={changedRecords}
              recordType={recordType}
              domain={domain}
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

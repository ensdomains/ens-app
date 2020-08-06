import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import { useMutation, useQuery, Mutation } from 'react-apollo'
import RecordLink from '../../../Links/RecordLink'
import mq from 'mediaQuery'

import {
  RecordsContent,
  RecordsItem,
  RecordsKey,
  RecordsSubKey
} from '../RecordsItem'
import RecordInput from '../../RecordInput'
import { useEditable } from '../../../hooks'
import PendingTx from 'components/PendingTx'
import Pencil from '../../../Forms/Pencil'
import Bin from '../../../Forms/Bin'
import SaveCancel from '../../SaveCancel'
import { emptyAddress } from '../../../../utils/utils'

const KeyValueItem = styled(RecordsItem)`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 100%;
  padding ${p => (p.editing ? '20px' : '0')};

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
  margin-bottom: 20px;

  ${mq.medium`
    flex-direction: row;
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

const Action = styled('div')`
  margin-top: 10px;
  margin-left: 0;
  ${mq.small`
    margin-top: 0;
    margin-left: auto;
  `}
`

const Actionable = ({ startEditing, keyName, value }) => {
  if (value && !value.error) {
    return (
      <Action>
        <Pencil
          onClick={startEditing}
          data-testid={`edit-${keyName.toLowerCase()}`}
        />
      </Action>
    )
  }
}

const EditRecord = styled('div')`
  width: 100%;
`

const Editable = ({
  editing,
  domain,
  textKey,
  validator,
  getPlaceholder,
  value,
  setUpdatedRecords,
  recordType,
  changedRecords
}) => {
  const hasBeenUpdated = changedRecords[recordType].find(
    record => record.key === textKey
  )
    ? true
    : false
  return (
    <KeyValueItem editing={editing} hasRecord={true} noBorder>
      {editing ? (
        <KeyValuesContent editing={editing}>
          <RecordsSubKey>{textKey}</RecordsSubKey>
          <RecordInput
            hasBeenUpdated={hasBeenUpdated}
            type="text"
            onChange={event => {
              const value = event.target.value
              setUpdatedRecords(state => ({
                ...state,
                [recordType]: state[recordType].map(record =>
                  record.key === textKey
                    ? {
                        ...record,
                        value
                      }
                    : record
                )
              }))
            }}
            value={value}
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
    name,
    setHasRecord,
    hasRecord,
    canEdit,
    editing,
    query,
    mutation,
    setUpdatedRecords,
    recordType,
    changedRecords
  } = props

  // const dataValue = Object.values(data)[0]
  // useEffect(() => {
  //   if (recordAdded === textKey) {
  //     let timeToWait = 200
  //     let timesToTry = 5
  //     let timesTried = 0
  //     refetch().then(({ data }) => {
  //       //retry until record is there or tried more than timesToTry
  //       let response = Object.values(data)[0]
  //       if (response === null || parseInt(response) === 0) {
  //         if (timesTried < timesToTry) {
  //           setTimeout(() => {
  //             refetch()
  //             timesTried++
  //           }, timeToWai\t * (timesTried + 1))
  //         }
  //       }
  //     })
  //   }
  // }, [recordAdded, refetch, textKey])
  useEffect(() => {
    if (dataValue && parseInt(dataValue, 16) !== 0 && !hasRecord) {
      setHasRecord(true)
    }
  }, [dataValue, hasRecord, setHasRecord])

  // if (error || loading || !dataValue || parseInt(dataValue, 16) === 0) {
  //   return null
  // }
  return canEdit ? (
    <Editable
      {...props}
      value={dataValue}
      validator={validator}
      getPlaceholder={getPlaceholder}
      editing={editing}
      mutation={mutation}
      setUpdatedRecords={setUpdatedRecords}
      changedRecords={changedRecords}
      recordType={recordType}
    />
  ) : (
    <ViewOnly textKey={textKey} value={dataValue} />
  )
}

function ViewOnly({ textKey, value }) {
  return (
    <RecordsListItem>
      <RecordsSubKey>{textKey}</RecordsSubKey>
      <RecordLink textKey={textKey} value={value} />
    </RecordsListItem>
  )
}

function Records({
  editing,
  domain,
  canEdit,
  query,
  mutation,
  records,
  validator,
  getPlaceholder,
  title,
  placeholderRecords,
  setUpdatedRecords,
  changedRecords,
  recordType
}) {
  const [hasRecord, setHasRecord] = useState(false)
  return (
    <KeyValueContainer hasRecord={hasRecord}>
      {hasRecord && <Key>{title}</Key>}
      <KeyValuesList>
        {records.map(({ key, value }) => {
          if (value === emptyAddress && !placeholderRecords.includes(key)) {
            return null
          }
          return (
            <Record
              editing={editing}
              key={key}
              dataValue={value}
              validator={validator}
              getPlaceholder={getPlaceholder}
              textKey={key}
              domain={domain}
              name={domain.name}
              setHasRecord={setHasRecord}
              hasRecord={hasRecord}
              canEdit={canEdit}
              mutation={mutation}
              setUpdatedRecords={setUpdatedRecords}
              changedRecords={changedRecords}
              recordType={recordType}
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

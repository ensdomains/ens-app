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
import DetailsItemInput from '../../DetailsItemInput'
import { useEditable } from '../../../hooks'
import PendingTx from 'components/PendingTx'
import Pencil from '../../../Forms/Pencil'
import Bin from '../../../Forms/Bin'
import SaveCancel from '../../SaveCancel'

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
  type
}) => {
  return (
    <KeyValueItem editing={editing} hasRecord={true} noBorder>
      {editing ? (
        <KeyValuesContent editing={editing}>
          <RecordsSubKey>{textKey}</RecordsSubKey>
          <input type="text" value={value} />
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
    mutation
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
  placeholderRecords
}) {
  const [hasRecord, setHasRecord] = useState(false)
  return (
    <KeyValueContainer hasRecord={hasRecord}>
      {hasRecord && <Key>{title}</Key>}
      <KeyValuesList>
        {records.map(({ key, value }) => {
          if (parseInt(value, 16) === 0 && !placeholderRecords.includes(key)) {
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
            />
          )
        })}
      </KeyValuesList>
    </KeyValueContainer>
  )
}

export default function KeyValueRecord({
  domain,
  editing,
  canEdit,
  refetch,
  recordAdded,
  mutation,
  records,
  loading,
  validator,
  getPlaceholder,
  title,
  placeholderRecords
}) {
  if (loading) return null
  return (
    <Records
      records={records}
      validator={validator}
      getPlaceholder={getPlaceholder}
      name={domain.name}
      domain={domain}
      editing={editing}
      canEdit={canEdit}
      refetch={refetch}
      mutation={mutation}
      title={title}
      placeholderRecords={placeholderRecords}
    />
  )
}

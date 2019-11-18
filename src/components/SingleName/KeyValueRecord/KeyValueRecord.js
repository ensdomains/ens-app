import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQuery, Mutation } from 'react-apollo'
import mq from 'mediaQuery'

import {
  RecordsContent,
  RecordsItem,
  RecordsKey,
  RecordsSubKey,
  RecordsValue
} from '../RecordsItem'
import DetailsItemInput from '../DetailsItemInput'
import { useEditable } from '../../hooks'
import PendingTx from 'components/PendingTx'
import Pencil from '../../Forms/Pencil'
import Bin from '../../Forms/Bin'
import SaveCancel from '../SaveCancel'

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

  ${mq.medium`
    flex-direction: row;
  `}
`

const KeyValuesList = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${mq.medium`
    width: calc(100% - 200px);
  `};
`

const Key = styled(RecordsKey)`
  margin-bottom: 20px;
`

const RecordsListItem = styled('div')`
  display: flex;
  flex-direction: column;

  ${mq.medium`
    flex-direction: row;
  `}
`

const Value = styled(RecordsValue)`
  padding-right: 0;
`

const KeyValuesContent = styled(RecordsContent)`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  padding-right: 30px;

  ${mq.small`
    grid-template-columns: 150px 1fr;
  `}
`

const Action = styled('div')`
  position: absolute;
  right: 10px;
  top: 0;
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
  domain,
  textKey,
  validator,
  getPlaceholder,
  value,
  type,
  refetch,
  mutation
}) => {
  const { state, actions } = useEditable()

  const { editing, newValue, txHash, pending, confirmed } = state

  const {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed
  } = actions

  let isValid = true
  let isInvalid = false

  const [setRecord] = useMutation(mutation, {
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })

  if (newValue === '') {
    isValid = false
  } else if (validator) {
    isValid = validator(textKey, newValue)
    isInvalid = !isValid
  } else {
    isValid = true
  }
  return (
    <KeyValueItem editing={editing} hasRecord={true} noBorder>
      <KeyValuesContent editing={editing}>
        <RecordsSubKey>{textKey}</RecordsSubKey>
        <Value editableSmall>{value}</Value>

        {pending && !confirmed && txHash ? (
          <PendingTx
            txHash={txHash}
            onConfirmed={() => {
              setConfirmed()
              refetch()
            }}
          />
        ) : editing ? (
          <Action>
            <Mutation
              mutation={mutation}
              variables={{
                name: domain.name,
                key: textKey,
                recordValue: ''
              }}
              onCompleted={data => {
                startPending(Object.values(data)[0])
              }}
            >
              {mutate => (
                <Bin
                  data-testid={`delete-KeyValue-${textKey.toLowerCase()}`}
                  onClick={e => {
                    e.preventDefault()
                    mutate()
                  }}
                />
              )}
            </Mutation>
          </Action>
        ) : (
          <Actionable
            startEditing={startEditing}
            keyName={textKey}
            value={value}
          />
        )}
      </KeyValuesContent>
      {editing ? (
        <>
          <EditRecord>
            <DetailsItemInput
              newValue={newValue}
              dataType={type}
              isValid={isValid}
              isInvalid={isInvalid}
              contentType={domain.contentType}
              updateValue={updateValue}
              placeholder={textKey}
              placeholder={getPlaceholder ? getPlaceholder(textKey) : ''}
            />
          </EditRecord>
          <SaveCancel
            mutation={e => {
              e.preventDefault()
              const variables = {
                name: domain.name,
                key: textKey,
                recordValue: newValue
              }
              setRecord({
                variables
              })
            }}
            isValid={isValid}
            stopEditing={stopEditing}
          />
        </>
      ) : (
        ''
      )}
    </KeyValueItem>
  )
}

function Record(props) {
  const {
    textKey,
    validator,
    getPlaceholder,
    name,
    setHasRecord,
    hasRecord,
    isOwner,
    recordAdded,
    query,
    mutation
  } = props
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      name,
      key: textKey
    }
  })
  const dataValue = Object.values(data)[0]
  useEffect(() => {
    if (recordAdded === textKey) {
      let timeToWait = 200
      let timesToTry = 5
      let timesTried = 0
      refetch().then(({ data }) => {
        //retry until record is there or tried more than timesToTry
        if (Object.values(data)[0] === null) {
          if (timesTried < timesToTry) {
            setTimeout(() => {
              refetch()
              timesTried++
            }, timeToWait * (timesTried + 1))
          }
        }
      })
    }
  }, [recordAdded])
  useEffect(() => {
    if (dataValue && !hasRecord) {
      setHasRecord(true)
    }
  }, [dataValue, hasRecord])

  if (error || loading || !dataValue || parseInt(dataValue, 16) === 0) {
    return null
  }
  return isOwner ? (
    <Editable
      {...props}
      value={dataValue}
      validator={validator}
      getPlaceholde={getPlaceholder}
      refetch={refetch}
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
      <RecordsValue>{value}</RecordsValue>
    </RecordsListItem>
  )
}

function Records({
  domain,
  isOwner,
  recordAdded,
  query,
  mutation,
  keys,
  validator,
  getPlaceholder,
  title
}) {
  const [hasRecord, setHasRecord] = useState(false)
  return (
    <KeyValueContainer hasRecord={hasRecord}>
      {hasRecord && <Key>{title}</Key>}
      <KeyValuesList>
        {keys.map(key => (
          <Record
            key={key}
            validator={validator}
            getPlaceholder={getPlaceholder}
            textKey={key}
            domain={domain}
            name={domain.name}
            setHasRecord={setHasRecord}
            hasRecord={hasRecord}
            isOwner={isOwner}
            recordAdded={recordAdded}
            query={query}
            mutation={mutation}
          />
        ))}
      </KeyValuesList>
    </KeyValueContainer>
  )
}

export default function KeyValueRecord({
  domain,
  isOwner,
  refetch,
  recordAdded,
  query,
  mutation,
  keys,
  validator,
  getPlaceholder,
  title
}) {
  return (
    <Records
      keys={keys}
      validator={validator}
      getPlaceholder={getPlaceholder}
      name={domain.name}
      domain={domain}
      isOwner={isOwner}
      refetch={refetch}
      recordAdded={recordAdded}
      query={query}
      mutation={mutation}
      title={title}
    />
  )
}

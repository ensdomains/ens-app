import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQuery, Mutation } from 'react-apollo'
import mq from 'mediaQuery'

import { SET_TEXT } from 'graphql/mutations'
import { GET_TEXT } from 'graphql/queries'
import { emptyAddress } from 'utils/utils'
import TEXT_RECORD_KEYS from './constants'

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

const TextRecordItem = styled(RecordsItem)`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  padding ${p => (p.editing ? '20px' : '0')};
`

const TextRecordContainer = styled('div')`
  ${p => (p.noRecords ? 'display: none' : 'display:flex')};
  flex-direction: row;
  padding: 20px;
`

const TextRecordsList = styled('div')`
  display: flex;
  flex-direction: column;
  width: calc(100% - 200px);
  ${mq.medium`
  `};
`

const TextRecordKey = styled(RecordsKey)``

const RecordsListItem = styled('div')`
  display: flex;
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

const Editable = ({ domain, textKey, value, type, refetch }) => {
  const { state, actions } = useEditable()

  const { editing, newValue, txHash, pending, confirmed } = state

  const {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed
  } = actions

  const isValid = true

  const [setText] = useMutation(SET_TEXT, {
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })

  const isInvalid = newValue !== '' && !isValid
  return (
    <>
      <TextRecordItem editing={editing} hasRecord={true} noBorder>
        <RecordsContent editing={editing}>
          <RecordsSubKey>{textKey}</RecordsSubKey>
          <RecordsValue editableSmall>{value}</RecordsValue>

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
                mutation={SET_TEXT}
                variables={{
                  name: domain.name,
                  key: textKey,
                  recordValue: emptyAddress
                }}
                onCompleted={data => {
                  startPending(Object.values(data)[0])
                }}
              >
                {mutate => (
                  <Bin
                    data-testid={`delete-textrecord-${textKey.toLowerCase()}`}
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
        </RecordsContent>
        {editing ? (
          <>
            <EditRecord>
              <DetailsItemInput
                newValue={newValue}
                dataType={type}
                contentType={domain.contentType}
                updateValue={updateValue}
                isValid={isValid}
                isInvalid={isInvalid}
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
                setText({
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
      </TextRecordItem>
    </>
  )
}

function Record(props) {
  const { textKey, name, setHasRecord, hasRecord, isOwner, recordAdded } = props
  const { data, loading, error, refetch } = useQuery(GET_TEXT, {
    variables: {
      name,
      key: textKey
    }
  })
  useEffect(() => {
    if (recordAdded === textKey) {
      let timeToWait = 200
      let timesToTry = 5
      let timesTried = 0
      refetch().then(({ data }) => {
        //retry until record is there or tried more than timesToTry
        if (data.getText === null) {
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
    if (data.getText && !hasRecord) {
      setHasRecord(true)
    }
  }, [data.getText, hasRecord])

  if (error || loading || !data.getText) {
    return null
  }
  return isOwner ? (
    <Editable {...props} value={data.getText} refetch={refetch} />
  ) : (
    <ViewOnly textKey={textKey} value={data.getText} />
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

function Records({ domain, isOwner, recordAdded }) {
  const [hasRecord, setHasRecord] = useState(false)
  return (
    <TextRecordContainer hasRecord={hasRecord}>
      {hasRecord && <TextRecordKey>Text Record</TextRecordKey>}
      <TextRecordsList>
        {TEXT_RECORD_KEYS.map(key => (
          <Record
            key={key}
            textKey={key}
            domain={domain}
            name={domain.name}
            setHasRecord={setHasRecord}
            hasRecord={hasRecord}
            isOwner={isOwner}
            recordAdded={recordAdded}
          />
        ))}
      </TextRecordsList>
    </TextRecordContainer>
  )
}

export default function TextRecord({ domain, isOwner, refetch, recordAdded }) {
  return (
    <>
      <Records
        name={domain.name}
        domain={domain}
        isOwner={isOwner}
        refetch={refetch}
        recordAdded={recordAdded}
      />
    </>
  )
}

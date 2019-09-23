import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQuery } from 'react-apollo'

import { SET_TEXT } from 'graphql/mutations'
import { GET_TEXT } from 'graphql/queries'

import {
  RecordsContent,
  RecordsItem,
  RecordsKey,
  RecordsSubKey,
  RecordsValue
} from '../RecordsItem'

const TEXT_RECORD_KEYS = [
  'email',
  'url',
  'avatar',
  'description',
  'notice',
  'keywords',
  'vnd.twitter',
  'vnd.github'
]

function Record({ textKey, name, setHasRecord, hasRecord }) {
  const { data, loading, error } = useQuery(GET_TEXT, {
    variables: {
      name,
      key: textKey
    }
  })

  useEffect(() => {
    if (data.getText) {
      setHasRecord(true)
    }
  }, [hasRecord])

  if (error || loading || !data.getText) {
    return null
  }

  return (
    <>
      <RecordsSubKey>{textKey}</RecordsSubKey>
      <RecordsValue>{data.getText}</RecordsValue>
    </>
  )
}

function Records({ name }) {
  const [hasRecord, setHasRecord] = useState(false)
  return (
    <RecordsItem hasRecord={hasRecord}>
      {hasRecord && <RecordsKey>Text Records</RecordsKey>}
      {TEXT_RECORD_KEYS.map(key => (
        <Record
          textKey={key}
          name={name}
          setHasRecord={setHasRecord}
          hasRecord={hasRecord}
        />
      ))}
    </RecordsItem>
  )
}

export default function TextRecord({ domain }) {
  let inputKey
  let inputValue
  const [setText, { data }] = useMutation(SET_TEXT)
  return (
    <div>
      <Records name={domain.name} />
      {/* <form
        onSubmit={e => {
          e.preventDefault()
          setText({
            variables: {
              name: domain.name,
              key: inputKey.value,
              recordValue: inputValue.value
            }
          })
          inputKey.value = ''
          inputValue.value = ''
        }}
      >
        <input
          ref={node => {
            inputKey = node
          }}
        />
        <input
          ref={node => {
            inputValue = node
          }}
        />
        <button type="submit">Add Text Record</button>
      </form> */}
    </div>
  )
}

import React from 'react'
import TEXT_RECORD_KEYS from './constants'
import KeyValueRecord from '../KeyValueRecord'

const getPlaceholder = key => {
  return `Enter ${key}`
}

export default function TextRecords(props) {
  return (
    <KeyValueRecord
      {...props}
      keys={TEXT_RECORD_KEYS}
      getPlaceholder={getPlaceholder}
    />
  )
}

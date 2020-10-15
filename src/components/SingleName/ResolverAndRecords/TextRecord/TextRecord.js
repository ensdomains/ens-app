import React from 'react'
import KeyValueRecord from '../KeyValueRecord'

const getPlaceholder = key => {
  return `Enter ${key}`
}

const PLACEHOLDER_RECORDS = ['vnd.twitter', 'vnd.github', 'url']

export default function TextRecords(props) {
  return (
    <KeyValueRecord
      {...props}
      records={props.updatedRecords.textRecords}
      placeholderRecords={PLACEHOLDER_RECORDS}
      getPlaceholder={getPlaceholder}
      setUpdatedRecords={props.setUpdatedRecords}
      recordType="textRecords"
    />
  )
}

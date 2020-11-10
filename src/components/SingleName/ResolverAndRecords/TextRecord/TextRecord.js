import React from 'react'
import KeyValueRecord from '../KeyValueRecord'

const getPlaceholder = key => {
  return `Enter ${key}`
}

export default function TextRecords(props) {
  return (
    <KeyValueRecord
      {...props}
      records={props.updatedRecords.textRecords}
      getPlaceholder={getPlaceholder}
      setUpdatedRecords={props.setUpdatedRecords}
      recordType="textRecords"
    />
  )
}

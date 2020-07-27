import React from 'react'
import KeyValueRecord from '../KeyValueRecord'
import { useQuery } from 'react-apollo'

const getPlaceholder = key => {
  return `Enter ${key}`
}

export default function TextRecords(props) {
  if (!props.textRecords) return null

  console.log('textRecords', props)
  return (
    <KeyValueRecord
      {...props}
      records={props.textRecords}
      getPlaceholder={getPlaceholder}
      updatedRecords={props.updatedRecords}
      setUpdatedRecords={props.setUpdatedRecords}
      recordType="textRecords"
    />
  )
}

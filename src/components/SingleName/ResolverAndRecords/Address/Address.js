import React from 'react'
import KeyValueRecord from '../KeyValueRecord'
import { validateRecord } from '../../../../utils/records'

const validator = (symbol, value) => {
  return validateRecord({
    type: 'otherAddresses',
    selectedKey: symbol,
    value
  })
}

const PLACEHOLDER_RECORDS = ['ETH', 'BTC', 'DOGE', 'ETC']

const getPlaceholder = symbol => {
  return `Enter a ${symbol} address`
}

export default function Address(props) {
  return (
    <KeyValueRecord
      {...props}
      records={props.addresses}
      placeholderRecords={PLACEHOLDER_RECORDS}
      validator={validator}
      getPlaceholder={getPlaceholder}
    />
  )
}

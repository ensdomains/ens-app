import React from 'react'
import KeyValueRecord from '../KeyValueRecord'
import { validateRecord } from '../../../../utils/records'

const validator = (symbol, value) => {
  return validateRecord({
    type: 'coins',
    selectedKey: symbol,
    value
  })
}

const PLACEHOLDER_RECORDS = ['ETH', 'BTC', 'DOGE', 'LTC']

const getPlaceholder = symbol => {
  return `Enter a ${symbol} address`
}

export default function Coins(props) {
  return (
    <KeyValueRecord
      {...props}
      {...{
        validator,
        getPlaceholder
      }}
      placeholderRecords={PLACEHOLDER_RECORDS}
      recordType="coins"
    />
  )
}

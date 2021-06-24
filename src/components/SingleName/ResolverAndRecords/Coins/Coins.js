import React from 'react'
import KeyValueRecord from '../KeyValueRecord'
import { validateRecord } from '../../../../utils/records'

const PLACEHOLDER_RECORDS = ['ETH', 'BTC', 'DOGE', 'LTC']

const getPlaceholder = symbol => {
  return `Enter a ${symbol} address`
}

export default function Coins(props) {
  return (
    <KeyValueRecord
      {...props}
      {...{
        getPlaceholder
      }}
      placeholderRecords={PLACEHOLDER_RECORDS}
      recordType="coins"
    />
  )
}

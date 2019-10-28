import React from 'react'
import { COIN_LIST } from './constants'
import KeyValueRecord from '../KeyValueRecord'
import { validateRecord } from '../../../utils/records'

const validator = (symbol, value) => {
  return validateRecord({
    type: 'otherAddresses',
    selectedKey: symbol,
    value
  })
}

export default function Address(props) {
  return <KeyValueRecord {...props} keys={COIN_LIST} validator={validator} />
}

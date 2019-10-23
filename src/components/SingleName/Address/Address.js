import React from 'react'
import { COIN_LIST } from './constants'
import KeyValueRecord from '../KeyValueRecord'
import { formatsByName } from '@ensdomains/address-encoder'

const validator = (symbol, value) => {
  let isValid = true
  try {
    formatsByName[symbol].decoder(value)
  } catch {
    isValid = false
  }
  return isValid
}

export default function Address(props) {
  return <KeyValueRecord {...props} keys={COIN_LIST} validator={validator} />
}

import React from 'react'
import { COIN_LIST } from './constants'
import KeyValueRecord from '../KeyValueRecord'

export default function Address(props) {
  return <KeyValueRecord {...props} keys={COIN_LIST} />
}

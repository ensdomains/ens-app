import React from 'react'
import Web3 from 'web3'
import AddressInput from '../components/Address/Address'

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546', null, {})

export const TestPage = () => {
  return <AddressInput provider={web3.givenProvider} className={{}} />
}

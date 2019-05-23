import React from 'react'
import Web3 from 'web3'
import Address from '../components/Address'

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546', null, {})

const DemoView = () => <Address provider={web3.givenProvider} />
export default DemoView

import React from 'react'
import Web3 from 'web3'
import Address from '../components/Address'
import styled from '@emotion/styled'
import mq from 'mediaQuery'
import { SingleNameBlockies } from '../components/SingleName/SingleNameBlockies'

const Blockies = styled(SingleNameBlockies)`
  position: absolute;
  top: 40%;
  left: -10px;
`

const AutoComplete = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
  `}

  .address {
    font-size: 18px;
    padding: 0 0 0 40px;
    font-family: Overpass;
    font-weight: 100;
    color: rgb(202, 202, 202);
  }
  .error {
    color: #cc0000;
    font-size: 18px;
    padding: 0 0 0 40px;
    font-family: Overpass;
    font-weight: 100;
  }
`

const AddressForm = styled('form')`
  display: flex;
  position: relative;
  z-index: 10000;

  input {
    padding: 20px 0 0 40px;
    width: 100%;
    border: none;
    border-radius: 0;
    font-size: 18px;
    font-family: Overpass;
    font-weight: 100;
    ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
    `}

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder {
      color: #ccd4da;
    }
  }

  button {
    background: #5284ff;
    color: white;
    font-size: 22px;
    font-family: Overpass;
    padding: 20px 0;
    height: 90px;
    width: 162px;
    border: none;
    display: none;
    ${mq.medium`
      display: block;
    `}

    &:hover {
      cursor: pointer;
    }
  }
`

const AddressStyle = {
  Blockies,
  AutoComplete,
  AddressForm
}

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546', null, {})

const DemoView = () => (
  <Address className={AddressStyle} provider={web3.givenProvider} />
)
export default DemoView

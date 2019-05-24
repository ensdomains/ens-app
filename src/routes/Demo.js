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
  position: relative;
  z-index: 10000;
  height: 90px;

  ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
  `}
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

  .address,
  .searching {
    font-size: 18px;
    padding: 0 0 0 40px;
    font-family: Overpass;
    font-weight: 100;
  }
  .error {
    color: #cc0000;
    font-size: 18px;
    padding: 0 0 0 40px;
    font-family: Overpass;
    font-weight: 100;
  }
`

const ClassName = {
  Blockies,
  AutoComplete
}

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546', null, {})

const DemoView = () => (
  <Address className={ClassName} provider={web3.givenProvider} />
)
export default DemoView

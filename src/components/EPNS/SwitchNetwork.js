import React from 'react'
import styled from '@emotion/styled'
import { default as Button } from '../Forms/Button'

const buttonStyles = `
  padding: 7px 20px;
  width: 200px;
`

const SwitchButton = styled(Button)`
  ${buttonStyles}
`

const NetworkSwitch = ({ children }) => {
  async function handleClick(e) {
    e.preventDefault()

    try {
      debugger
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }]
      })
      console.log('You have switched to the Ethereum Main network')
    } catch (switchError) {
      console.error('Cannot switch to the network', switchError)
    }
  }

  return (
    <>
      <SwitchButton type="hollow-primary" onClick={handleClick}>
        {children}
      </SwitchButton>
    </>
  )
}

export default NetworkSwitch

import React, { useState } from 'react'
import styled from '@emotion/styled'

import Button from '../Forms/Button'
import { useModal, Modal } from './Modal'
import { WCcontent } from './ModalContent'
import {connectWC, disconnectWC} from 'connectWC'

const WCStateButton = styled(Button)`
  position: absolute;
  top: 14px;
  left: 180px;
  text-transform: capitalize;

  padding: 4px 15px;

  &:hover {
    background: #2c46a636;
    box-shadow: none;
  }
`
const WCconnector = ({ isWalletConnectConnected, refetch }) => {
  const [modalProps, {open, close}] = useModal({
    onClose: () => setURI(null)
  })
  const [uri, setURI] = useState(null)

  const onURI = uri => {
    console.log('onURI', uri);
    setURI(uri)
    open()
  }

  return (
    <>
      {isWalletConnectConnected ? (
        <WCStateButton type="hollow-white" onClick={disconnectWC}>Disconnect WalletConnect</WCStateButton>
      ) : (
          <WCStateButton type="hollow-white" onClick={async () => {
            try {
              await connectWC({onDisconnect: refetch, onURI})
              close()
              await refetch()
            } catch (error) {
              console.log('Error connecting to WalletConnect', error);
            }
          }}>Connect WalletConnect</WCStateButton>
        )}
      <Modal {...modalProps}>
        <WCcontent uri={uri}/>
      </Modal>
    </>
  )
}

export default WCconnector
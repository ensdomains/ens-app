import React from 'react'
import styled from 'react-emotion'

const EtherScanLinkContainer = styled('a')``

const EtherScanLink = ({ children, address, className }) => (
  <EtherScanLinkContainer
    target="_blank"
    href={`http://etherscan.io/address/${address}`}
    className={className}
  >
    {children}
  </EtherScanLinkContainer>
)

export default EtherScanLink

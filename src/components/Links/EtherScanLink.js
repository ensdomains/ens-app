import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'

const EtherScanLinkContainer = styled('a')`
  display: inline-block;
  align-items: center;
  text-overflow: ellipsis;

  svg {
    margin-left: 10px;
    transition: 0.1s;
    opacity: 0;
    flex-shrink: 0;
  }

  &:hover {
    svg {
      opacity: 1;
    }
  }
`

const EtherScanLink = ({ children, address, className }) => (
  <EtherScanLinkContainer
    target="_blank"
    href={`http://etherscan.io/address/${address}`}
    className={className}
  >
    {children}
    <ExternalLinkIcon />
  </EtherScanLinkContainer>
)

export default EtherScanLink

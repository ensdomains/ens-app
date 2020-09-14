import React from 'react'
import styled from '@emotion/styled/macro'
import useNetworkInfo from '../NetworkInformation/useNetworkInfo'
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

const EtherScanLink = ({ children, address, className }) => {
  const { network } = useNetworkInfo()
  const subdomain = network === 'main' ? '' : `${network}.`
  return (
    <EtherScanLinkContainer
      target="_blank"
      rel="noopener"
      href={`https://${subdomain}etherscan.io/address/${address}`}
      className={className}
    >
      {children}
      <ExternalLinkIcon />
    </EtherScanLinkContainer>
  )
}

export default EtherScanLink

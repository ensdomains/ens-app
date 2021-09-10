import React from 'react'
import styled from '@emotion/styled/macro'
import useNetworkInfo from '../NetworkInformation/useNetworkInfo'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'

import ref from '../../constants/referral.json'

const OpenSeaLinkContainer = styled('a')`
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

const OpenSeaLink = ({ children, domainTokenId, className }) => {
  const { network } = useNetworkInfo()
  const subdomain = network === 'main' ? '' : `${network}.`
  return (
    <OpenSeaLinkContainer
      target="_blank"
      rel="noopener"
      href={`https://${subdomain}opensea.io/assets/${
        ref.COLLECTION_ADDRESS
      }/${domainTokenId}?ref=${ref.REFERRAL_FEE_ADDRESS}`}
      title="View asset on OpenSea"
      className={className}
    >
      {children}
      <ExternalLinkIcon />
    </OpenSeaLinkContainer>
  )
}

export default OpenSeaLink

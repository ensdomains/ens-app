import React from 'react'
import styled from '@emotion/styled/macro'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'
import { decodeContenthash, encodeContenthash } from '@ensdomains/ui'
import useNetworkInfo from '../NetworkInformation/useNetworkInfo'

const ContentHashLinkContainer = styled('a')`
  display: inline-block;
  align-items: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  svg {
    margin-left: 10px;
    transition: 0.1s;
    opacity: 0;
  }

  &:hover {
    svg {
      opacity: 1;
    }
  }
`

const DecodedError = styled('div')`
  white-space: normal;
  overflow: scroll;
`

const ContentHashLink = ({ value, contentType, domain }) => {
  const { networkId } = useNetworkInfo()
  if (contentType === 'oldcontent') {
    return <div>{value}</div>
  }

  const encoded = encodeContenthash(value)
  const { protocolType, decoded, error } = decodeContenthash(encoded)
  let externalLink, url
  if (error) {
    return <DecodedError>{error}</DecodedError>
  }
  // TODO: Change from .domains to .link
  const ethUrl =
    !!domain.name.match('.eth$') && networkId === 1
      ? `https://${domain.name}.domains`
      : null
  if (protocolType === 'ipfs') {
    externalLink = ethUrl || `https://dweb.link/ipfs/${decoded}` // using ipfs's secured origin gateway
    url = `ipfs://${decoded}`
  } else if (protocolType === 'ipns') {
    externalLink = ethUrl || `https://dweb.link/ipns/${decoded}`
    url = `ipns://${decoded}`
  } else if (protocolType === 'bzz') {
    externalLink = `https://swarm-gateways.net/bzz://${decoded}`
    url = `bzz://${decoded}`
  } else if (protocolType === 'onion' || protocolType === 'onion3') {
    externalLink = `http://${decoded}.onion`
    url = `onion://${decoded}`
  } else {
    console.warn(`Unsupported protocol ${protocolType}`)
  }
  return (
    <ContentHashLinkContainer target="_blank" href={externalLink}>
      {url}
      <ExternalLinkIcon />
    </ContentHashLinkContainer>
  )
}

export default ContentHashLink

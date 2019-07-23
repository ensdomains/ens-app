import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'
import { decodeContenthash, encodeContenthash } from '@ensdomains/ui'

const ContentHashLinkContainer = styled('a')`
  display: inline-block;
  align-items: center;
  text-overflow: ellipsis;
  white-space: normal;
  overflow: scroll;
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

const ContentHashLink = ({ value, contentType }) => {
  if (contentType === 'oldcontent') {
    return <div>{value}</div>
  }

  const encoded = encodeContenthash(value)
  const { protocolType, decoded, error } = decodeContenthash(encoded)
  let externalLink, url
  if (error) {
    return <DecodedError>{error}</DecodedError>
  }
  if (protocolType === 'ipfs') {
    externalLink = `https://gateway.ipfs.io/ipfs/${decoded}`
    url = `ipfs://${decoded}`
  } else if (protocolType === 'bzz') {
    externalLink = `https://swarm-gateways.net/bzz://${decoded}`
    url = `bzz://${decoded}`
  } else if (protocolType === 'onion') {
    externalLink = `https://${decoded}.onion.link`
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

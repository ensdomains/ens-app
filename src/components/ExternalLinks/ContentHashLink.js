import React from 'react'
import styled from 'react-emotion'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'

const ContentHashLinkContainer = styled('a')`
  display: inline-block;
  align-items: center;
  text-overflow: ellipsis;

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

const ContentHashLink = ({ address, protocolType }) => {
  let externalLink, url
  if (!protocolType){
    return (<div>{address}</div>)
  }
  if(protocolType === 'ipfs'){
    externalLink = `https://gateway.ipfs.io/ipfs/${address}`
    url = `ipfs://${address}`
  }else if(protocolType === 'bzz'){
    externalLink = `https://swarm-gateways.net/bzz://${address}`
    url = `bzz://${address}`
  }else{
    console.warn(`Unsupported protocol ${protocolType}`)
  }
  return(
    <ContentHashLinkContainer
      target="_blank"
      href={externalLink}
    >
      {url}
      <ExternalLinkIcon />
    </ContentHashLinkContainer>
  )
}

export default ContentHashLink


import React from 'react'
import styled from 'react-emotion'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'
import { decode } from '../../utils/contents'

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

const ContentHashLink = ({ value, contentType }) => {
  if(contentType == 'oldcontent'){
    return (<div>{value}</div>)    
  }
  const { protocolType, decoded } = decode(value)
  let externalLink, url
  if (!protocolType){
    return (<div>{decoded}</div>)
  }
  if(protocolType === 'ipfs'){
    externalLink = `https://gateway.ipfs.io/ipfs/${decoded}`
    url = `ipfs://${decoded}`
  }else if(protocolType === 'bzz'){
    externalLink = `https://swarm-gateways.net/bzz://${decoded}`
    url = `bzz://${decoded}`
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


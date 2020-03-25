import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'

const LinkContainer = styled('a')`
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

const TextRecordLink = ({ textKey, value }) => {
  let url
  switch (textKey) {
    case 'url':
      url = `${value}`
      break
    case 'vnd.twitter':
      url = `twitter.com/${value}`
      break
    case 'vnd.github':
      url = `github.com/${value}`
      break
    default:
  }
  if (url && !url.match(/http[s]?:\/\//)) {
    url = 'https://' + url
  }
  if (textKey == 'email') {
    url = `mailto:${value}`
  }
  return url ? (
    <LinkContainer target="_blank" href={url}>
      {value}
      <ExternalLinkIcon />
    </LinkContainer>
  ) : (
    value
  )
}

export default TextRecordLink

import React from 'react'
import styled from '@emotion/styled/macro'
import { ReactComponent as ExternalLinkIcon } from '../Icons/externalLink.svg'

const LinkContainer = styled('a')`
  display: block;
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

const AvatarImage = styled('img')`
  width: 180px;
  margin: 1em 0;
`

const prependUrl = url => {
  if (url && !url.match(/http[s]?:\/\//)) {
    return 'https://' + url
  } else {
    return url
  }
}

const TextRecordLink = ({ textKey, value }) => {
  let url, avatar
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
  url = prependUrl(url)

  if (textKey === 'email') {
    url = `mailto:${value}`
  }
  if (textKey === 'avatar') {
    avatar = prependUrl(value)
  }

  return url ? (
    <LinkContainer target="_blank" href={url}>
      {value}
      <ExternalLinkIcon />
    </LinkContainer>
  ) : avatar ? (
    <div>
      <LinkContainer target="_blank" href={value}>
        {value}
        <ExternalLinkIcon />
      </LinkContainer>
      <AvatarImage src={value} alt="avatar" />
    </div>
  ) : (
    value
  )
}

export default TextRecordLink

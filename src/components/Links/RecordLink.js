import React from 'react'
import styled from '@emotion/styled/macro'
import externalLinkSvg from '../Icons/externalLink.svg'
import CopyToClipboard from '../CopyToClipboard/'
import { isRecordEmpty, prependUrl, imageUrl } from '../../utils/utils'
import useNetworkInfo from '../NetworkInformation/useNetworkInfo'

const LinkContainer = styled('div')`
  display: block;
  align-items: center;
  a {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    .external-link {
      margin-left: 5px;
      transition: 0.1s;
      opacity: 0;
    }
    &:hover {
      .external-link {
        opacity: 1;
      }
    }
  }
`

const UnlinkedValue = styled('div')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NotSet = styled('div')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ccc;
`

const UnlinkedValueContainer = styled('div')`
  display: inline-flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AvatarImage = styled('img')`
  width: 180px;
  margin: 1em 0;
`

const RecordLink = ({ textKey, value, name }) => {
  let url, avatar
  const { network } = useNetworkInfo()

  switch (textKey) {
    case 'url':
      url = `${value}`
      break
    case 'com.twitter':
      url = `twitter.com/${value}`
      break
    case 'com.github':
      url = `github.com/${value}`
      break
    default:
  }
  url = prependUrl(url)

  if (textKey === 'email') {
    url = `mailto:${value}`
  }
  if (textKey === 'avatar') {
    avatar = imageUrl(value, name, network)
  }
  const isEmpty = isRecordEmpty(value)

  return url && !isEmpty ? (
    <LinkContainer>
      <a target="_blank" href={url} rel="noopener noreferrer">
        {value}
        <img
          src={externalLinkSvg}
          className="external-link"
          alt="external-link-svg"
        />
      </a>
      <CopyToClipboard value={value} />
    </LinkContainer>
  ) : avatar && !isEmpty ? (
    <div>
      <LinkContainer>
        <a target="_blank" href={value} rel="noopener noreferrer">
          {value}
          <img
            src={externalLinkSvg}
            className="external-link"
            alt="external-link-svg"
          />
        </a>

        <CopyToClipboard value={value} />
      </LinkContainer>
      <AvatarImage src={avatar} alt="avatar" />
    </div>
  ) : (
    <UnlinkedValueContainer>
      {isEmpty ? (
        <NotSet>Not set</NotSet>
      ) : (
        <>
          <UnlinkedValue data-testid={`unlinked-value-${textKey}`}>
            {value}
          </UnlinkedValue>
          <CopyToClipboard value={value} />
        </>
      )}
    </UnlinkedValueContainer>
  )
}

export default RecordLink

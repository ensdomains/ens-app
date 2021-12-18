import React from 'react'
import styled from '@emotion/styled/macro'
import externalLinkSvg from '../Icons/externalLink.svg'
import CopyToClipboard from '../CopyToClipboard/'
import { isRecordEmpty, prependUrl } from '../../utils/utils'
import useNetworkInfo from '../NetworkInformation/useNetworkInfo'
import { useAvatar } from '../hooks'

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

const OwnerLabel = styled('span')`
  background: rgb(66, 224, 104);
  color: white;
  border-radius: 5px;
  padding: 0 5px;
  margin-right: 5px;
`

const RecordLink = ({ textKey, value, name }) => {
  let url
  const { network } = useNetworkInfo()
  switch (textKey) {
    case 'eth.ens.delegate':
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
  const { is_owner, host_meta, image: imageUrl } = useAvatar(
    textKey,
    name,
    network,
    value
  )
  const isEmpty = isRecordEmpty(value)

  return url && !isEmpty ? (
    <LinkContainer>
      <a
        target="_blank"
        href={url}
        rel="noopener noreferrer"
        aria-label={textKey}
      >
        {value}
        <img
          src={externalLinkSvg}
          className="external-link"
          alt="external-link-svg"
        />
      </a>
      <CopyToClipboard value={value} />
    </LinkContainer>
  ) : imageUrl && !isEmpty ? (
    <div>
      <LinkContainer>
        {is_owner && <OwnerLabel>Owner</OwnerLabel>}
        <a
          target="_blank"
          href={host_meta?.reference_url}
          rel="noopener noreferrer"
          aria-label={textKey}
        >
          {value}
          <img
            src={externalLinkSvg}
            className="external-link"
            alt="external-link-svg"
          />
        </a>

        <CopyToClipboard value={value} />
      </LinkContainer>
      <AvatarImage src={imageUrl} alt="avatar" />
    </div>
  ) : (
    <UnlinkedValueContainer>
      {isEmpty ? (
        <NotSet>Not set</NotSet>
      ) : (
        <>
          <UnlinkedValue
            data-testid={`unlinked-value-${textKey}`}
            tabIndex={0}
            aria-label={textKey}
          >
            {value}
          </UnlinkedValue>
          <CopyToClipboard value={value} />
        </>
      )}
    </UnlinkedValueContainer>
  )
}

export default RecordLink

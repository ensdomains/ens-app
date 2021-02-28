import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'

import { validateRecord } from 'utils/records'
import { emptyAddress } from 'utils/utils'
import mq from 'mediaQuery'

import { DetailsItem, DetailsKey, DetailsValue } from '../DetailsItem'
import Upload from '../../IPFS/Upload'
import IpfsLogin from '../../IPFS/Login'
import StyledUpload from '../../Forms/Upload'
import ContentHashLink from '../../Links/ContentHashLink'
import Pencil from '../../Forms/Pencil'
import DefaultBin from '../../Forms/Bin'
import RecordInput from '../RecordInput'
import CopyToClipBoard from '../../CopyToClipboard/'
import { useEditable } from '../../hooks'
import Button from '../../Forms/Button'
import RequestCertificate from './RequestCertificate'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'
import { ReactComponent as ExternalLinkIcon } from '../../Icons/externalLink.svg'

export const RecordsItem = styled(DetailsItem)`
  ${p => !p.hasRecord && 'display: none;'}
  ${p => (p.noBorder ? '' : 'border-top: 1px dashed #d3d3d3;')}
  display: block;
  padding: 20px;
  flex-direction: column;
  ${mq.small`
    align-items: flex-start;
  `}

  border-bottom: 1px dashed #d3d3d3;

  ${mq.medium`
    display: flex;
    flex-direction: column;
  `}
`

export const RecordsContent = styled('div')`
  display: grid;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  ${mq.medium`
    display: flex;
  `}
  ${({ editing }) => editing && 'margin-bottom: 30px'};
`

export const RecordsKey = styled(DetailsKey)`
  font-size: 12px;
  margin-bottom: 0;
  max-width: 100%;
  margin-right: 10px;
  align-self: flex-start;
  ${mq.medium`
    width: 180px;
    margin-right: 0px;
  `}

  ${mq.large`
    width: 200px;
    margin-right: 0px;
  `}
`

export const RecordsSubKey = styled('div')`
  font-family: Overpass Mono;
  font-weight: 500;
  font-size: 14px;
  color: #adbbcd;
  letter-spacing: 0;

  ${mq.small`
    font-size: 16px;
    max-width: 220px;
    min-width: 180px;
  `}
`

export const RecordsValue = styled(DetailsValue)`
  font-size: 14px;
  margin-top: 1em;
  ${mq.small`
      margin-top: 0;
  `}
`

const NewRecordsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 21px;
  overflow: hidden;
  ${mq.medium`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `}
`

const EditRecord = styled('div')`
  width: 100%;
`

const Action = styled('div')`
  margin-left: 0;
  ${mq.small`
    margin-left: auto;
  `};
`

const Bin = styled(DefaultBin)`
  align-self: flex-start;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
`

const SecondaryAction = styled('div')`
  margin-right: 10px;
`

const NotSet = styled('div')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ccc;
`

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

const Uploadable = ({ startUploading, keyName, value }) => {
  if (value && !value.error) {
    return (
      <SecondaryAction>
        <StyledUpload
          onClick={startUploading}
          data-testid={`edit-upload-temporal`}
        />
      </SecondaryAction>
    )
  }
  return null
}

const Switch = styled(Button)`
  margin-bottom: 5px;
  ${mq.small`
    margin-right: 20px;
    margin-bottom: 0px; 
  `}
`

const ContentHashEditable = ({
  domain,
  keyName,
  value,
  type,

  changedRecords,
  variableName,
  account,
  editing,
  updatedRecords,
  setUpdatedRecords
}) => {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const { contentType } = domain
  const { authorized, uploading, newValue } = state

  const {
    startUploading,
    stopUploading,
    startAuthorizing,
    stopAuthorizing,
    updateValue
  } = actions

  const isValid = validateRecord({
    type,
    value,
    contentType: domain.contentType
  })

  const isInvalid = value !== '' && !isValid
  const hasBeenUpdated = changedRecords.hasOwnProperty('content')

  return (
    <>
      <RecordsItem editing={editing} hasRecord={true}>
        <RecordsContent editing={editing}>
          <RecordsKey>{t(`c.${keyName}`)}</RecordsKey>
          {!editing && (
            <RecordsValue editableSmall>
              {value === '' ||
              value === emptyAddress ||
              value === undefined ||
              value === 'undefined' ? (
                <NotSet>Not set</NotSet>
              ) : (
                <ContentHashLinkWithEthLink
                  value={value}
                  contentType={contentType}
                  domain={domain}
                />
              )}
            </RecordsValue>
          )}

          {editing ? (
            <>
              <EditRecord>
                <RecordInput
                  testId={`content-record-input${isInvalid ? '-invalid' : ''}`}
                  onChange={event => {
                    const value = event.target.value
                    setUpdatedRecords(records => ({
                      ...records,
                      content: value
                    }))
                  }}
                  hasBeenUpdated={hasBeenUpdated}
                  value={value}
                  dataType={type}
                  contentType={domain.contentType}
                  isValid={isValid}
                  isInvalid={isInvalid}
                />
                {/* 
                <Uploadable
                  startUploading={startUploading}
                  keyName={keyName}
                  value={value}
                />
                {uploading && !authorized && (
                  <IpfsLogin startAuthorizing={startAuthorizing} />
                )}

                {uploading && authorized && (
                  <>
                    <Upload
                      updateValue={value => {
                        updateValue(value)
                        setUpdatedRecords(records => {
                          return {
                            ...records,
                            content: value
                          }
                        })
                      }}
                      newValue={newValue}
                    />
                    {value !== '' ? (
                      <NewRecordsContainer>
                        <RecordsKey>New IPFS Hash:</RecordsKey>
                        <ContentHashLink
                          value={value}
                          contentType={domain.contentType}
                        />
                      </NewRecordsContainer>
                    ) : (
                      <NotSet>Not set</NotSet>
                    )}
                    {value !== '' && (
                      <Switch
                        data-testid="reset"
                        type="hollow"
                        onClick={startUploading}
                      >
                        New Upload
                      </Switch>
                    )}
                    <Switch
                      data-testid="switch"
                      type="hollow"
                      onClick={stopAuthorizing}
                    >
                      Logout
                    </Switch>
                    <Switch
                      data-testid="cancel"
                      type="hollow"
                      onClick={stopUploading}
                    >
                      Cancel
                    </Switch>
                  </>
                )} */}
              </EditRecord>
            </>
          ) : null}
          {editing && (
            <Action>
              <Bin
                data-testid={`delete-${type.toLowerCase()}`}
                onClick={e => {
                  e.preventDefault()
                  setUpdatedRecords(records => {
                    return {
                      ...records,
                      content: ''
                    }
                  })
                }}
              />
            </Action>
          )}
          {!editing && <RequestCertificate domain={domain} />}
        </RecordsContent>
      </RecordsItem>
    </>
  )
}

function ContentHashLinkWithEthLink({ value, contentType, domain }) {
  const { networkId } = useNetworkInfo()
  const displayEthLink =
    !!domain.name.match('.eth$') && networkId === 1 && value?.match(/^ip/)
  return (
    <>
      <div>
        <ContentHashLink
          value={value}
          contentType={contentType}
          domain={domain}
        />
        {displayEthLink && (
          <div>
            <LinkContainer
              target="_blank"
              rel="noopener"
              href={`https://${domain.name}.link`}
            >
              ({`https://${domain.name}.link`})
              <ExternalLinkIcon />
            </LinkContainer>
          </div>
        )}
      </div>
      <div>
        <CopyToClipBoard value={value} />
        <div>{displayEthLink && <>&nbsp;</>}</div>
      </div>
    </>
  )
}

function ContentHashViewOnly({ keyName, value, type, domain, account }) {
  const { name, contentType } = domain
  const { t } = useTranslation()
  return keyName !== 'Address' && contentType === 'error' ? (
    ''
  ) : (
    <RecordsItem>
      <RecordsContent>
        <RecordsKey>{t(`c.${keyName}`)}</RecordsKey>
        <RecordsValue>
          {value !== '' ? (
            <ContentHashLinkWithEthLink
              value={value}
              contentType={contentType}
              domain={domain}
            />
          ) : (
            <NotSet>Not set</NotSet>
          )}
        </RecordsValue>
        <RequestCertificate domain={domain} />
      </RecordsContent>
    </RecordsItem>
  )
}

function ContentHash(props) {
  const { canEdit } = props
  if (canEdit) return <ContentHashEditable {...props} />

  return <ContentHashViewOnly {...props} />
}

ContentHash.propTypes = {
  keyName: PropTypes.string.isRequired, // key of the record
  value: PropTypes.string.isRequired, // value of the record (normally hex address)
  type: PropTypes.string, // type of value. Defaults to address
  editButton: PropTypes.string, //Edit button text
  domain: PropTypes.object.isRequired,
  variableName: PropTypes.string, //can change the variable name for mutation
  account: PropTypes.string,
  changedRecords: PropTypes.array
}

export default ContentHash

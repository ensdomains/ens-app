import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled/macro'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import DefaultAddressInput from '@ensdomains/react-ens-address'

import { SET_CONTENT, SET_CONTENTHASH, SET_ADDRESS } from 'graphql/mutations'

import { validateRecord } from 'utils/records'
import { emptyAddress } from 'utils/utils'
import mq from 'mediaQuery'
import { getOldContentWarning } from './warnings'
import { getEnsAddress } from '../../../apollo/mutations/ens'

import { DetailsItem, DetailsKey, DetailsValue } from '../DetailsItem'
import Upload from '../../IPFS/Upload'
import IpfsLogin from '../../IPFS/Login'
import StyledUpload from '../../Forms/Upload'
import AddressLink from '../../Links/AddressLink'
import ContentHashLink from '../../Links/ContentHashLink'
import Pencil from '../../Forms/Pencil'
import Bin from '../../Forms/Bin'
import { SaveCancel, SaveCancelSwitch } from '../SaveCancel'
import DefaultPendingTx from '../../PendingTx'
import DetailsItemInput from '../DetailsItemInput'
import CopyToClipBoard from '../../CopyToClipboard/'
import { useEditable } from '../../hooks'

const AddressInput = styled(DefaultAddressInput)`
  margin-bottom: 10px;
`

export const RecordsItem = styled(DetailsItem)`
  ${p => !p.hasRecord && 'display: none;'}
  ${p => (p.noBorder ? '' : 'border-top: 1px dashed #d3d3d3;')}
  display: block;
  padding: 20px;
  flex-direction: column;
   ${mq.small`
    align-items: flex-start;
  `}

  background: ${({ editing }) => (editing ? 'white' : 'white')};
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
`

export const RecordsKey = styled(DetailsKey)`
  font-size: 12px;
  margin-bottom: 0;
  max-width: 100%;
  margin-right: 10px;
  ${mq.medium`
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
  font-family: Overpass Mono;
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

const SecondaryAction = styled('div')`
  margin-right: 10px;
`

const ActionContainer = styled('div')`
  display: flex;
  margin-left: 0;
  margin-top: 10px;
  align-self: flex-end;
  ${mq.small`
    margin-top: 0;
    margin-left: auto;
  `};
`

const PendingTx = styled(DefaultPendingTx)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -65%);
`

function chooseMutation(recordType, contentType) {
  switch (recordType) {
    case 'Content':
      if (contentType === 'oldcontent') {
        return SET_CONTENT
      } else {
        return SET_CONTENTHASH
      }
    case 'Address':
      return SET_ADDRESS
    default:
      throw new Error('Not a recognised record type')
  }
}

const Actionable = ({ startEditing, keyName, value }) => {
  if (value && !value.error) {
    return (
      <Action>
        <Pencil
          onClick={startEditing}
          data-testid={`edit-${keyName.toLowerCase()}`}
        />
      </Action>
    )
  }
}

const Uploadable = ({ startUploading, keyName, value }) => {
  if (value && !value.error) {
    return (
      <SecondaryAction>
        <StyledUpload
          onClick={startUploading}
          data-testid={'edit-upload-temporal'}
        />
      </SecondaryAction>
    )
  }
}

const RecordItemEditable = ({
  domain,
  keyName,
  value,
  type,
  mutation,
  refetch,
  variableName,
  account
}) => {
  const { t } = useTranslation()
  const { state, actions } = useEditable()

  const {
    editing,
    authorized,
    uploading,
    newValue,
    txHash,
    pending,
    confirmed
  } = state

  const {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed,
    startUploading,
    stopUploading,
    startAuthorizing,
    stopAuthorizing
  } = actions

  const isValid = validateRecord({
    type,
    value: newValue,
    contentType: domain.contentType
  })

  const isInvalid = newValue !== '' && !isValid
  const [executeMutation] = useMutation(mutation, {
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })

  return (
    <>
      <RecordsItem editing={editing} hasRecord={true}>
        <RecordsContent editing={editing}>
          <RecordsKey>{t(`c.${keyName}`)}</RecordsKey>
          <RecordsValue editableSmall>
            {type === 'address' ? (
              <AddressLink address={value}>{value}</AddressLink>
            ) : (
              <ContentHashLink
                value={value}
                contentType={domain.contentType}
                domain={domain}
              />
            )}
            <CopyToClipBoard value={value} />
          </RecordsValue>

          {pending && !confirmed && txHash ? (
            <PendingTx
              txHash={txHash}
              onConfirmed={() => {
                setConfirmed()
                refetch()
              }}
            />
          ) : editing || uploading ? (
            <Action>
              {() => {
                const [mutate] = useMutation(
                  chooseMutation(keyName, domain.contentType),
                  {
                    onCompleted: data => {
                      startPending(Object.values(data)[0])
                    }
                  }
                )
                return (
                  <Bin
                    data-testid={`delete-${type.toLowerCase()}`}
                    onClick={e => {
                      e.preventDefault()
                      mutate({
                        variables: {
                          name: domain.name,
                          recordValue: emptyAddress
                        }
                      })
                    }}
                  />
                )
              }}
            </Action>
          ) : (
            <ActionContainer>
              {type === 'address' ? (
                <Actionable
                  startEditing={startEditing}
                  keyName={keyName}
                  value={value}
                />
              ) : (
                <>
                  <Uploadable
                    startUploading={startUploading}
                    keyName={keyName}
                    value={value}
                  />
                  <Actionable
                    startEditing={startEditing}
                    keyName={keyName}
                    value={value}
                  />
                </>
              )}
            </ActionContainer>
          )}
        </RecordsContent>
        {editing ? (
          <>
            <EditRecord>
              {type === 'address' ? (
                <AddressInput
                  provider={
                    window.ethereum || window.web3 || 'http://localhost:8545'
                  }
                  onResolve={({ address }) => {
                    if (address) {
                      updateValue(address)
                    } else {
                      updateValue('')
                    }
                  }}
                  ensAddress={getEnsAddress()}
                />
              ) : (
                <DetailsItemInput
                  newValue={newValue}
                  dataType={type}
                  contentType={domain.contentType}
                  updateValue={updateValue}
                  isValid={isValid}
                  isInvalid={isInvalid}
                />
              )}
            </EditRecord>
            <SaveCancel
              warningMessage={getOldContentWarning(type, domain.contentType)}
              mutation={e => {
                e.preventDefault()
                const variables = {
                  name: domain.name,
                  [variableName ? variableName : 'recordValue']: newValue
                }
                executeMutation({
                  variables
                })
              }}
              isValid={isValid}
              stopEditing={stopEditing}
            />
          </>
        ) : uploading && authorized ? (
          <>
            <EditRecord>
              <Upload updateValue={updateValue} newValue={newValue} />
              {newValue !== '' && (
                <NewRecordsContainer>
                  <RecordsKey>New IPFS Hash:</RecordsKey>
                  <ContentHashLink
                    value={newValue}
                    contentType={domain.contentType}
                    domain={domain}
                  />
                </NewRecordsContainer>
              )}
            </EditRecord>
            <SaveCancelSwitch
              warningMessage={getOldContentWarning(type, domain.contentType)}
              mutation={e => {
                e.preventDefault()
                const variables = {
                  name: domain.name,
                  [variableName ? variableName : 'recordValue']: newValue
                }
                executeMutation({
                  variables
                })
              }}
              isValid={isValid}
              newValue={newValue}
              startUploading={startUploading}
              stopUploading={stopUploading}
              stopAuthorizing={stopAuthorizing}
            />
          </>
        ) : uploading && !authorized ? (
          <>
            <IpfsLogin startAuthorizing={startAuthorizing} />
            <SaveCancel
              warningMessage={getOldContentWarning(type, domain.contentType)}
              mutation={e => {
                e.preventDefault()
                const variables = {
                  name: domain.name,
                  [variableName ? variableName : 'recordValue']: newValue
                }
                executeMutation({
                  variables
                })
              }}
              isValid={isValid}
              stopEditing={stopUploading}
            />
          </>
        ) : (
          ''
        )}
      </RecordsItem>
    </>
  )
}

function RecordItemViewOnly({ keyName, value, type, domain }) {
  const { contentType } = domain
  const { t } = useTranslation()
  return keyName !== 'Address' && contentType === 'error' ? (
    ''
  ) : (
    <RecordsItem>
      <RecordsContent>
        <RecordsKey>{t(`c.${keyName}`)}</RecordsKey>
        <RecordsValue>
          {type === 'address' ? (
            <AddressLink address={value}>{value}</AddressLink>
          ) : (
            <ContentHashLink
              value={value}
              contentType={contentType}
              domain={domain}
            />
          )}
          <CopyToClipBoard value={value} />
        </RecordsValue>
        <Action>
          <Pencil
            disabled={true}
            data-testid={`edit-${keyName.toLowerCase()}`}
          />
        </Action>
      </RecordsContent>
    </RecordsItem>
  )
}

function RecordItem(props) {
  const { canEdit } = props
  if (canEdit) return <RecordItemEditable {...props} />

  return <RecordItemViewOnly {...props} />
}

RecordItem.propTypes = {
  keyName: PropTypes.string.isRequired, // key of the record
  value: PropTypes.string.isRequired, // value of the record (normally hex address)
  type: PropTypes.string, // type of value. Defaults to address
  mutation: PropTypes.object.isRequired, //graphql mutation string for making tx
  mutationButton: PropTypes.string, // Mutation button text
  editButton: PropTypes.string, //Edit button text
  domain: PropTypes.object.isRequired,
  variableName: PropTypes.string, //can change the variable name for mutation
  refetch: PropTypes.func.isRequired,
  account: PropTypes.string
}

export default RecordItem

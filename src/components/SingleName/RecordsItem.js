import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import DefaultAddressInput from '@ensdomains/react-ens-address'

import { validateRecord } from '../../utils/records'
import { emptyAddress } from '../../utils/utils'
import mq from 'mediaQuery'

import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import AddReverseRecord from './AddReverseRecord'
import AddressLink from '../Links/AddressLink'
import ContentHashLink from '../Links/ContentHashLink'
import Pencil from '../Forms/Pencil'
import Bin from '../Forms/Bin'
import SaveCancel from './SaveCancel'
import DefaultPendingTx from '../PendingTx'
import {
  SET_CONTENT,
  SET_CONTENTHASH,
  SET_ADDRESS
} from '../../graphql/mutations'
import DetailsItemInput from './DetailsItemInput'
import { useEditable } from '../hooks'
import { getOldContentWarning } from './warnings'

const AddressInput = styled(DefaultAddressInput)`
  margin-bottom: 10px;
`

export const RecordsItem = styled(DetailsItem)`
  ${p => !p.hasRecord && 'display: none;'}
  ${p => (p.noBorder ? '' : 'border-top: 1px dashed #d3d3d3;')}
  display: block;
  padding: 20px;
  flex-direction: column;

  background: ${({ editing }) => (editing ? '#F0F6FA' : 'white')};
  ${mq.medium`
    display: flex;
  `}
`

export const RecordsContent = styled('div')`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
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
`

const EditRecord = styled('div')`
  width: 100%;
`

const Action = styled('div')`
  position: absolute;
  right: 10px;
  top: 0;
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

const Editable = ({
  domain,
  keyName,
  value,
  type,
  mutation,
  refetch,
  variableName,
  account
}) => {
  const { state, actions } = useEditable()

  const { editing, newValue, txHash, pending, confirmed } = state

  const {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed
  } = actions
  const isValid = validateRecord({
    type,
    value: newValue,
    contentType: domain.contentType
  })

  const isInvalid = newValue !== '' && !isValid
  return (
    <>
      <Mutation
        mutation={mutation}
        onCompleted={data => {
          startPending(Object.values(data)[0])
          refetch()
        }}
      >
        {mutation => (
          <RecordsItem editing={editing} hasRecord={true}>
            <RecordsContent editing={editing}>
              <RecordsKey>{keyName}</RecordsKey>
              <RecordsValue editableSmall>
                {type === 'address' ? (
                  <AddressLink address={value}>{value}</AddressLink>
                ) : (
                  <ContentHashLink
                    value={value}
                    contentType={domain.contentType}
                  />
                )}
              </RecordsValue>

              {pending && !confirmed && txHash ? (
                <PendingTx
                  txHash={txHash}
                  onConfirmed={() => {
                    setConfirmed()
                    refetch()
                  }}
                />
              ) : editing ? (
                <Action>
                  <Mutation
                    mutation={chooseMutation(keyName, domain.contentType)}
                    variables={{
                      name: domain.name,
                      recordValue: emptyAddress
                    }}
                    onCompleted={data => {
                      startPending(Object.values(data)[0])
                    }}
                  >
                    {mutate => (
                      <Bin
                        data-testid={`delete-${type.toLowerCase()}`}
                        onClick={e => {
                          e.preventDefault()
                          mutate()
                        }}
                      />
                    )}
                  </Mutation>
                </Action>
              ) : (
                <Actionable
                  startEditing={startEditing}
                  keyName={keyName}
                  value={value}
                />
              )}
            </RecordsContent>
            {editing ? (
              <>
                <EditRecord>
                  {type === 'address' ? (
                    <AddressInput
                      provider={window.ethereum || window.web3}
                      onResolve={({ address }) => {
                        if (address) {
                          updateValue(address)
                        } else {
                          updateValue('')
                        }
                      }}
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
                  warningMessage={getOldContentWarning(
                    type,
                    domain.contentType
                  )}
                  mutation={e => {
                    e.preventDefault()
                    const variables = {
                      name: domain.name,
                      [variableName ? variableName : 'recordValue']: newValue
                    }
                    mutation({
                      variables
                    })
                  }}
                  isValid={isValid}
                  stopEditing={stopEditing}
                />
              </>
            ) : (
              ''
            )}
            {keyName === 'Address' && (
              <AddReverseRecord account={account} name={domain.name} />
            )}
          </RecordsItem>
        )}
      </Mutation>
    </>
  )
}

class RecordItem extends Component {
  _renderViewOnly() {
    const { keyName, value, type, domain, account } = this.props
    const { name, contentType } = domain
    return keyName !== 'Address' && contentType === 'error' ? (
      ''
    ) : (
      <RecordsItem>
        <RecordsContent>
          <RecordsKey>{keyName}</RecordsKey>
          <RecordsValue>
            {type === 'address' ? (
              <AddressLink address={value}>{value}</AddressLink>
            ) : (
              <ContentHashLink value={value} contentType={contentType} />
            )}
          </RecordsValue>
          <Action>
            <Pencil
              disabled={true}
              data-testid={`edit-${keyName.toLowerCase()}`}
            />
          </Action>
        </RecordsContent>
        {keyName === 'Address' &&
          value.toLowerCase() === account.toLowerCase() && (
            <AddReverseRecord account={account} name={name} />
          )}
      </RecordsItem>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? <Editable {...this.props} /> : this._renderViewOnly()
  }
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

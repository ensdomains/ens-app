import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { css } from 'emotion'
import moment from 'moment'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Mutation, Query, useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import EthVal from 'ethval'

import { GET_PUBLIC_RESOLVER, GET_RENT_PRICE } from '../../graphql/queries'
import { SET_RESOLVER, SET_SUBNODE_OWNER, SET_OWNER } from 'graphql/mutations'

import mq from 'mediaQuery'
import { useEditable, useEthPrice } from '../hooks'
import { yearInSeconds, formatDate } from 'utils/dates'
import { trackReferral } from 'utils/analytics'
import { addressUtils, emptyAddress } from 'utils/utils'
import { refetchTilUpdatedSingle } from 'utils/graphql'
import Bin from '../Forms/Bin'
import { useAccount } from '../QueryAccount'
import { getEnsAddress } from '../../api/ens'

import AddToCalendar from '../Calendar'
import Tooltip from '../Tooltip/Tooltip'
import { SingleNameBlockies } from '../Blockies'
import DefaultAddressLink from '../Links/AddressLink'
import {
  DetailsItem,
  DetailsKey,
  DetailsValue as DefaultDetailsValue,
  DetailsContent
} from './DetailsItem'
import DefaultSaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Button from '../Forms/Button'
import Pencil from '../Forms/Pencil'
import DefaultInfo from '../Icons/Info'
import DefaultPendingTx from '../PendingTx'
import DefaultPricer from './Pricer'
import DefaultAddressInput from '@ensdomains/react-ens-address'
import CopyToClipboard from '../CopyToClipboard/'

const AddressInput = styled(DefaultAddressInput)`
  margin-bottom: 10px;
`

const AddressLink = styled(DefaultAddressLink)`
  display: flex;
  align-items: center;
`

const Address = styled('span')`
  display: inline-block;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Info = styled(DefaultInfo)`
  flex-shrink: 0;
`

const EditButton = styled(Button)`
  width: 130px;
`

const WarningMessage = styled('span')`
  color: #f6412d;
  margin-right: auto;
  margin-bottom: 1em;
  ${mq.small`
    margin-bottom: 0em;
  `}
`

const DetailsEditableContainer = styled(DetailsItem)`
  flex-direction: column;
  min-height: 30px;

  background: ${({ editing, backgroundStyle }) => {
    switch (backgroundStyle) {
      case 'warning':
        return editing ? 'transparent' : 'transparent'
      default:
        return editing ? '#F0F6FA' : 'transparent'
    }
  }};
  padding: ${({ editing }) => (editing ? '20px' : '0')};
  ${({ editing }) => (editing ? `margin-bottom: 20px;` : '')}
  transition: 0.3s;

  ${({ editing }) => editing && mq.small` flex-direction: column;`};
`

const DetailsValue = styled(DefaultDetailsValue)`
  ${p =>
    p.expiryDate &&
    `
      overflow: inherit;
      display: flex;
       align-items: flex-start;
      flex-direction: column;
  `}

  ${p =>
    p.expiryDate &&
    mq.medium`
      margin-top: -16px;
      align-items: center;
      flex-direction: row;
  `}
`

const ExpiryDate = styled('span')`
  margin-right: 10px;
`

const EditRecord = styled(motion.div)`
  width: 100%;
`

const Input = styled(DefaultInput)`
  margin-bottom: 20px;
`

const Action = styled(motion.div)`
  margin-left: 0;
  margin-top: 20px;
  ${mq.small`
     margin-left: auto;
  align-self: center;
  margin-top: -10px;
  `}
`

const PendingTx = styled(DefaultPendingTx)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -65%);
`

const DefaultResolverButton = styled('a')`
  display: flex;
  padding-right: 20px;
  &:hover {
    cursor: pointer;
  }
`

const Pricer = styled(DefaultPricer)``

const Buttons = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
`

const SaveCancel = motion.custom(DefaultSaveCancel)

function getMessages({ keyName, parent, deedOwner, isDeedOwner, t }) {
  let [newValue, newType] = getDefaultMessage(keyName, t)
  if (
    keyName === 'Owner' &&
    parent === 'eth' &&
    parseInt(deedOwner, 16) !== 0
  ) {
    newValue = t('singleName.messages.noresolver')
    if (isDeedOwner) {
      newValue += t('singleName.messages.notfinalise')
    }
  }

  return [newValue, newType]
}

function getDefaultMessage(keyName, t) {
  switch (keyName) {
    case 'Resolver':
      return [t('singleName.messages.noresolver'), 'message']
    case 'Controller':
    case 'registrant':
      return [t('singleName.messages.noowner'), 'message']
    default:
      return ['No 0x message set', 'message']
  }
}

function getToolTipMessage({ keyName, t, isExpiredRegistrant }) {
  switch (keyName) {
    case 'Resolver':
      return t(`singleName.tooltips.detailsItem.${keyName}`)
    case 'Controller':
      return t(`singleName.tooltips.detailsItem.${keyName}`)
    case 'registrant':
      if (isExpiredRegistrant) {
        return t(`singleName.tooltips.detailsItem.${keyName}Expired`)
      }
      return t(`singleName.tooltips.detailsItem.${keyName}`)
    default:
      return 'You can only make changes if you are the controller and are logged into your wallet'
  }
}

function isOwnerOfParentDomain(domain, account) {
  if (domain.parentOwner !== emptyAddress) {
    return domain.parentOwner.toLowerCase() === account.toLowerCase()
  }
  return false
}

function chooseMutation(recordType, isOwnerOfParent) {
  switch (recordType) {
    case 'Controller':
      if (isOwnerOfParent) {
        return SET_SUBNODE_OWNER
      } else {
        return SET_OWNER
      }
    case 'Resolver':
      return SET_RESOLVER
    default:
      throw new Error('Not a recognised record type')
  }
}

function getInputType(
  keyName,
  type,
  {
    newValue,
    presetValue,
    updateValue,
    isValid,
    isInvalid,
    name,
    ethUsdPriceLoading,
    ethUsdPrice,
    years,
    setYears,
    duration,
    expirationDate,
    rentPriceLoading,
    rentPrice
  }
) {
  if (keyName === 'Expiration Date') {
    return (
      <Pricer
        name={name.split('.')[0]}
        duration={duration}
        years={years}
        setYears={years => {
          setYears(years)
          updateValue(formatDate(expirationDate))
        }}
        ethUsdPriceLoading={ethUsdPriceLoading}
        ethUsdPrice={ethUsdPrice}
        expirationDate={expirationDate}
        loading={rentPriceLoading}
        price={rentPrice}
      />
    )
  }

  if (type === 'address') {
    let option = {
      presetValue: presetValue || '',
      provider: window.ethereum || window.web3 || 'http://localhost:8545',
      onResolve: ({ address }) => {
        if (address) {
          updateValue(address)
        } else {
          updateValue('')
        }
      },
      ensAddress: getEnsAddress()
    }
    if (keyName === 'Resolver') {
      option.placeholder =
        'Use the Public Resolver or enter the address of your custom resolver contract'
    }
    return <AddressInput {...option} />
  }

  return (
    <Input
      value={newValue}
      onChange={e => updateValue(e.target.value)}
      valid={isValid}
      invalid={isInvalid}
      placeholder=""
      large
    />
  )
}

function getValidation(keyName, newValue) {
  switch (keyName) {
    case 'Expiration Date':
      return true
    default:
      return addressUtils.isAddress(newValue) && newValue !== emptyAddress
  }
}

function getVariables(keyName, { domain, variableName, newValue, duration }) {
  if (keyName === 'Expiration Date') {
    return {
      label: domain.name.split('.')[0],
      duration
    }
  } else {
    return {
      name: domain.name,
      [variableName ? variableName : 'address']: newValue
    }
  }
}

const Editable = ({
  isExpired,
  showLabel = true,
  editButtonType = 'primary',
  backgroundStyle = 'blue',
  keyName,
  value,
  type,
  mutation,
  mutationButton,
  editButton,
  domain,
  variableName,
  refetch,
  confirm,
  copyToClipboard
}) => {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const [presetValue, setPresetValue] = useState('')

  const { editing, newValue, txHash, pending, confirmed } = state

  const {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed
  } = actions

  //only used with Expiration date
  let duration
  let expirationDate
  const [years, setYears] = useState(1)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const { price: ethUsdPrice, loading: ethUsdPriceLoading } = useEthPrice(
    keyName === 'Expiration Date'
  )
  if (keyName === 'Expiration Date') {
    duration = parseFloat(years) * yearInSeconds
    expirationDate = new Date(new Date(value).getTime() + duration * 1000)
  }

  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: domain.label
      },
      skip: keyName !== 'Expiration Date'
    }
  )

  const isValid = getValidation(keyName, newValue)
  const isInvalid = !isValid && newValue.length > 0
  const account = useAccount()
  const isOwnerOfParent = isOwnerOfParentDomain(domain, account)
  const isRegistrant = domain.registrant === account
  const canDelete = ['Controller', 'Resolver'].includes(keyName)
  return (
    <Mutation
      mutation={mutation}
      onCompleted={data => {
        const txHash = Object.values(data)[0]
        startPending(txHash)
        if (keyName === 'Expiration Date') {
          trackReferral({
            labels: [domain.label], // labels array
            transactionId: txHash, //hash
            type: 'renew', // renew/register
            price: new EthVal(`${getRentPrice._hex}`)
              .toEth()
              .mul(ethUsdPrice)
              .toFixed(2) // in wei, // in wei
          })
        }
      }}
    >
      {mutation => (
        <DetailsEditableContainer
          editing={editing}
          backgroundStyle={backgroundStyle}
        >
          <DetailsContent editing={editing}>
            {showLabel && (
              <>
                <DetailsKey>{t(`c.${keyName}`)}</DetailsKey>
                <DetailsValue
                  editing={editing}
                  editable
                  data-testid={`details-value-${keyName.toLowerCase()}`}
                  expiryDate={type === 'date'}
                >
                  {type === 'address' ? (
                    <AddressLink address={value}>
                      <SingleNameBlockies address={value} imageSize={24} />
                      {keyName === 'Resolver' &&
                      domain.contentType === 'oldcontent' ? (
                        <Tooltip
                          text='<p>This resolver is outdated and does not support the new content hash.<br/>Click the "Set" button to update  to the latest public resolver.</p>'
                          position="top"
                          border={true}
                        >
                          {({ tooltipElement, showTooltip, hideTooltip }) => (
                            <>
                              <Info
                                onMouseOver={() => {
                                  showTooltip()
                                }}
                                onMouseLeave={() => {
                                  hideTooltip()
                                }}
                              />
                              {tooltipElement}
                            </>
                          )}
                        </Tooltip>
                      ) : null}
                      <Address>{value}</Address>
                    </AddressLink>
                  ) : type === 'date' ? (
                    <>
                      <ExpiryDate>{formatDate(value)}</ExpiryDate>
                      <AddToCalendar
                        css={css`
                          margin-right: 20px;
                        `}
                        name={domain.name}
                        startDatetime={moment(value)
                          .utc()
                          .subtract(30, 'days')}
                      />
                    </>
                  ) : (
                    value
                  )}
                  {copyToClipboard && <CopyToClipboard value={value} />}
                </DetailsValue>
              </>
            )}
            {editing ? null : pending && !confirmed ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={() => {
                  if (keyName === 'registrant') {
                    refetchTilUpdatedSingle({
                      refetch,
                      interval: 300,
                      keyToCompare: 'registrant',
                      prevData: {
                        singleName: domain
                      },
                      getterString: 'singleName'
                    })
                  } else {
                    refetch()
                  }
                  setConfirmed()
                }}
              />
            ) : (
              <Action
                initial={{
                  opacity: 0,
                  x: 0
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: 0
                }}
              >
                {editButton ? (
                  <EditButton
                    type={editButtonType}
                    onClick={startEditing}
                    data-testid={`edit-${keyName.toLowerCase()}`}
                  >
                    {editButton}
                  </EditButton>
                ) : (
                  <Pencil
                    onClick={startEditing}
                    data-testid={`edit-${keyName.toLowerCase()}`}
                  />
                )}
              </Action>
            )}
            {editing && canDelete ? (
              <Action>
                <Mutation
                  mutation={chooseMutation(keyName, isOwnerOfParent)}
                  variables={{
                    name: domain.name,
                    address: emptyAddress
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
              ''
            )}
          </DetailsContent>
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{
                  height: 0,
                  width: 0,
                  opacity: 0
                }}
                animate={{
                  height: 'auto',
                  width: '100%',
                  opacity: 1
                }}
                exit={{
                  height: 0,
                  width: 0,
                  opacity: 0
                }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              >
                <EditRecord
                  initial={{
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{ ease: 'easeOut', duration: 0.3 }}
                >
                  {getInputType(keyName, type, {
                    newValue,
                    updateValue,
                    presetValue,
                    isValid,
                    isInvalid,
                    years,
                    name: domain.name,
                    setYears,
                    ethUsdPrice,
                    duration,
                    expirationDate,
                    rentPriceLoading,
                    rentPrice: getRentPrice
                  })}
                </EditRecord>
                <Buttons>
                  {keyName === 'Expiration Date' && !isRegistrant ? (
                    <WarningMessage>
                      *{t('singleName.expiry.cannotown')}
                    </WarningMessage>
                  ) : (
                    ''
                  )}
                  {keyName === 'Resolver' && (
                    <Query query={GET_PUBLIC_RESOLVER}>
                      {({ data, loading }) => {
                        if (loading) return null
                        return (
                          <DefaultResolverButton
                            onClick={e => {
                              e.preventDefault()
                              setPresetValue(data.publicResolver.address)
                            }}
                          >
                            Use Public Resolver
                          </DefaultResolverButton>
                        )
                      }}
                    </Query>
                  )}

                  <SaveCancel
                    stopEditing={stopEditing}
                    mutation={() => {
                      const variables = getVariables(keyName, {
                        domain,
                        variableName,
                        newValue,
                        duration
                      })
                      mutation({
                        variables
                      })
                    }}
                    value={
                      keyName === 'Expiration Date' ? formatDate(value) : value
                    }
                    newValue={
                      keyName === 'Expiration Date'
                        ? formatDate(expirationDate)
                        : newValue
                    }
                    mutationButton={mutationButton}
                    confirm={true}
                    isValid={isValid}
                  />
                </Buttons>
              </motion.div>
            )}
          </AnimatePresence>
        </DetailsEditableContainer>
      )}
    </Mutation>
  )
}

function ViewOnly({
  editButton,
  value,
  keyName,
  type,
  deedOwner,
  isDeedOwner,
  domain,
  isExpiredRegistrant,
  copyToClipboard
}) {
  const { t } = useTranslation()
  //get default messages for 0x values
  if (parseInt(value, 16) === 0) {
    let [newValue, newType] = getMessages({
      keyName,
      parent: domain.parent,
      deedOwner,
      isDeedOwner,
      t
    })

    value = newValue
    type = newType
  }
  return (
    <DetailsEditableContainer>
      <DetailsContent>
        <DetailsKey>{t(`c.${keyName}`)}</DetailsKey>
        <DetailsValue data-testid={`details-value-${keyName.toLowerCase()}`}>
          {type === 'address' ? (
            <AddressLink address={value}>
              <SingleNameBlockies address={value} imageSize={24} />
              {value}
            </AddressLink>
          ) : type === 'date' ? (
            formatDate(value)
          ) : (
            value
          )}
          {copyToClipboard && <CopyToClipboard value={value} />}
        </DetailsValue>

        <Action>
          {editButton ? (
            <Tooltip
              text={getToolTipMessage({ keyName, t, isExpiredRegistrant })}
              position="top"
              border={true}
              warning={true}
              offset={{ left: -30, top: 10 }}
            >
              {({ tooltipElement, showTooltip, hideTooltip }) => {
                return (
                  <EditButton
                    onMouseOver={() => {
                      showTooltip()
                    }}
                    onMouseLeave={() => {
                      hideTooltip()
                    }}
                    data-testid={`edit-${keyName.toLowerCase()}`}
                    type="disabled"
                  >
                    {editButton}
                    {tooltipElement}
                  </EditButton>
                )
              }}
            </Tooltip>
          ) : (
            <Pencil
              data-testid={`edit-${keyName.toLowerCase()}`}
              disabled={true}
            />
          )}
        </Action>
      </DetailsContent>
    </DetailsEditableContainer>
  )
}

function DetailsEditable(props) {
  return props.canEdit ? <Editable {...props} /> : <ViewOnly {...props} />
}

DetailsEditable.propTypes = {
  showLabel: PropTypes.string, // defaults to true, shows label
  keyName: PropTypes.string.isRequired, // key of the record
  value: PropTypes.string.isRequired, // value of the record (normally hex address)
  type: PropTypes.string, // type of value. Defaults to address
  mutation: PropTypes.object.isRequired, //graphql mutation string for masking tx
  onCompleted: PropTypes.func, // function to be called on the onCompleted
  mutationButton: PropTypes.string, // Mutation button text
  editButton: PropTypes.string, //Edit button text
  buttonType: PropTypes.string, // style of the edit button
  canEdit: PropTypes.bool,
  domain: PropTypes.object.isRequired,
  variableName: PropTypes.string, //can change the variable name for mutation
  refetch: PropTypes.func.isRequired,
  copyToClipboard: PropTypes.bool
}

export default DetailsEditable

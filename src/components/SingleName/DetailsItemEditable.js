import React, { useState, useEffect } from 'react'
import { css } from 'emotion'
import moment from 'moment'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import EthVal from 'ethval'

import {
  GET_PUBLIC_RESOLVER,
  GET_RENT_PRICE,
  IS_CONTRACT_CONTROLLER
} from '../../graphql/queries'
import { SET_RESOLVER, SET_SUBNODE_OWNER, SET_OWNER } from 'graphql/mutations'

import mq from 'mediaQuery'
import { useEditable, useEthPrice } from '../hooks'
import { calculateDuration, formatDate } from 'utils/dates'
import { trackReferral } from 'utils/analytics'
import { addressUtils, emptyAddress } from 'utils/utils'
import { refetchTilUpdatedSingle } from 'utils/graphql'
import Bin from '../Forms/Bin'
import { useAccount } from '../QueryAccount'
import { getEnsAddress } from '../../apollo/mutations/ens'

import AddToCalendar from '../Calendar/RenewalCalendar'
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
import { isOwnerOfParentDomain } from '../../utils/utils'

const AddressInput = styled(DefaultAddressInput)`
  margin-bottom: 10px;
`

const AddressLink = styled(DefaultAddressLink)`
  display: flex;
  align-items: center;
`

const Address = styled('span')`
  display: block;
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
        return editing ? '#282929' : 'transparent'
    }
  }};
  padding: ${({ editing }) => (editing ? '20px' : '0')};
  ${({ editing }) => (editing ? 'margin-bottom: 20px;' : '')}
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

const ResolverAddressWarning = styled('span')`
  color: #f6412d;
  margin-left: 3em;
  margin-right: auto;
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
      return SET_SUBNODE_OWNER
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
    rentPrice,
    placeholder
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
  const ensAddress = getEnsAddress()
  const provider =
    process.env.REACT_APP_STAGE === 'local'
      ? 'http://localhost:8545'
      : window.ethereum || window.web3
  if (type === 'address' && keyName !== 'Resolver') {
    let option = {
      presetValue: presetValue || '',
      provider,
      onResolve: ({ address }) => {
        if (address) {
          updateValue(address)
        } else {
          updateValue('')
        }
      },
      ensAddress
    }
    return <AddressInput {...option} />
  }

  return (
    <Input
      value={newValue}
      onChange={e => updateValue(e.target.value)}
      valid={isValid}
      invalid={isInvalid}
      placeholder={keyName === 'Resolver' ? placeholder : ''}
      large
    />
  )
}

function getValidation(keyName, newValue, isContractAddress) {
  switch (keyName) {
    case 'Expiration Date':
      return true
    case 'Resolver':
      return !!isContractAddress
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
  mutation: mutationQuery,
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

  const { price: ethUsdPrice, loading: ethUsdPriceLoading } = useEthPrice(
    keyName === 'Expiration Date'
  )
  if (keyName === 'Expiration Date') {
    duration = calculateDuration(years)
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
  const isNewResolverAddress =
    keyName === 'Resolver' &&
    addressUtils.isAddress(newValue) &&
    newValue !== emptyAddress
  const { data: { isContractController: isContractAddress } = {} } = useQuery(
    IS_CONTRACT_CONTROLLER,
    {
      variables: {
        address: newValue
      },
      skip: !isNewResolverAddress
    }
  )
  const isValid = getValidation(keyName, newValue, isContractAddress)

  const isInvalid = !isValid && newValue.length > 0
  const account = useAccount()
  const isOwnerOfParent = isOwnerOfParentDomain(domain, account)
  const isRegistrant = !domain.available && domain.registrant === account
  const canDelete = ['Resolver'].includes(keyName)
  const placeholder = t('singleName.resolver.placeholder')
  const [mutation] = useMutation(mutationQuery, {
    onCompleted: data => {
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
            .toFixed(2), // in wei, // in wei
          years
        })
      }
    }
  })

  const [ownerMutation] = useMutation(
    chooseMutation(keyName, isOwnerOfParent),
    {
      variables: {
        name: domain.name,
        address: emptyAddress
      },
      onCompleted: data => {
        startPending(Object.values(data)[0])
      }
    }
  )

  const { data, loading } = useQuery(GET_PUBLIC_RESOLVER, {
    fetchPolicy: 'network-only'
  })

  return (
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
                    owner={domain.owner}
                    registrant={domain.registrant}
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
        {editing &&
        canDelete &&
        (keyName === 'Controller' || keyName === 'Resolver') ? (
          <Action>
            <Bin
              data-testid={`delete-${type.toLowerCase()}`}
              onClick={e => {
                e.preventDefault()
                ownerMutation()
              }}
            />
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
                ethUsdPriceLoading,
                duration,
                expirationDate,
                rentPriceLoading,
                rentPrice: getRentPrice,
                placeholder
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
                <>
                  {isNewResolverAddress && !isContractAddress && (
                    <ResolverAddressWarning data-testid="resolver-address-warning">
                      {t('singleName.resolver.resolverAddressWarning')}
                    </ResolverAddressWarning>
                  )}
                  {!loading && (
                    <DefaultResolverButton
                      onClick={e => {
                        e.preventDefault()
                        updateValue(data.publicResolver.address)
                      }}
                    >
                      {t('singleName.resolver.publicResolver')}
                    </DefaultResolverButton>
                  )}
                </>
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

export default DetailsEditable

import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Mutation, Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'

import { GET_PUBLIC_RESOLVER } from '../../graphql/queries'
import mq from 'mediaQuery'
import { useEditable, useEthPrice } from '../hooks'
import { yearInSeconds, formatDate } from 'utils/dates'
import { addressUtils } from 'utils/utils'

import Tooltip from '../Tooltip/Tooltip'
import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultAddressLink from '../Links/AddressLink'
import {
  DetailsItem,
  DetailsKey,
  DetailsValue,
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

const DetailsEditableContainer = styled(DetailsItem)`
  flex-direction: column;

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

const EditRecord = styled(motion.div)`
  width: 100%;
`

const Input = styled(DefaultInput)`
  margin-bottom: 20px;
`

const Action = styled(motion.div)`
  margin-top: 20px;
  ${mq.small`
    margin-top: 0;
    position: absolute;
    right: 10px;
    top: 0;
    transform: translate(0, -65%);
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
    case 'Registrant':
      return [t('singleName.messages.noowner'), 'message']
    default:
      return ['No 0x message set', 'message']
  }
}

function getToolTipMessage(keyName, t) {
  switch (keyName) {
    case 'Resolver':
      return t(`singleName.tooltips.detailsItem.${keyName}`)
    case 'Controller':
      return t(`singleName.tooltips.detailsItem.${keyName}`)
    case 'Registrant':
      return t(`singleName.tooltips.detailsItem.${keyName}`)
    default:
      return 'You can only make changes if you are the controller and are logged into your wallet'
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
    duringMigration
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
      />
    )
  }

  if (type === 'address') {
    let option = {
      presetValue: presetValue || '',
      provider: window.ethereum || window.web3,
      onResolve: ({ address }) => {
        if (address) {
          updateValue(address)
        } else {
          updateValue('')
        }
      }
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
      return addressUtils.isAddress(newValue)
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
  showLabel = true,
  editButtonType = 'primary',
  backgroundStyle = 'blue',
  keyName,
  value,
  type,
  notes,
  mutation,
  mutationButton,
  editButton,
  domain,
  variableName,
  refetch,
  confirm
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
    duration = parseFloat(years) * yearInSeconds
    expirationDate = new Date(new Date(value).getTime() + duration * 1000)
  }

  const isValid = getValidation(keyName, newValue)
  const isInvalid = !isValid && newValue.length > 0

  return (
    <Mutation
      mutation={mutation}
      onCompleted={data => {
        startPending(Object.values(data)[0])
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
                    formatDate(value)
                  ) : (
                    value
                  )}
                  {notes}
                </DetailsValue>
              </>
            )}
            {editing ? null : pending && !confirmed ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={() => {
                  refetch()
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
                    expirationDate
                  })}
                </EditRecord>
                <Buttons>
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
                      mutation({ variables })
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
                    isValid={true}
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
  domain
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
        </DetailsValue>

        <Action>
          {editButton ? (
            <Tooltip
              text={getToolTipMessage(keyName, t)}
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
  notes: PropTypes.string,
  mutation: PropTypes.object.isRequired, //graphql mutation string for making tx
  mutationButton: PropTypes.string, // Mutation button text
  editButton: PropTypes.string, //Edit button text
  buttonType: PropTypes.string, // style of the edit button
  canEdit: PropTypes.bool,
  domain: PropTypes.object.isRequired,
  variableName: PropTypes.string, //can change the variable name for mutation
  refetch: PropTypes.func.isRequired,
  duringMigration: PropTypes.bool
}

export default DetailsEditable

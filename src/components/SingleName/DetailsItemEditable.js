import React, { Component, useState } from 'react'
import styled from '@emotion/styled'
import { Mutation, Query } from 'react-apollo'
import { addressUtils } from '@0xproject/utils'
import PropTypes from 'prop-types'
import { Transition } from 'react-spring'

import { GET_PUBLIC_RESOLVER } from '../../graphql/queries'
import mq from 'mediaQuery'
import { useEditable, useEthPrice } from '../hooks'
import { yearInSeconds, formatDate } from 'utils/dates'

import Tooltip from '../Tooltip/Tooltip'
import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import SaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Button from '../Forms/Button'
import Pencil from '../Forms/Pencil'
import DefaultInfo from '../Icons/Info'
import DefaultPendingTx from '../PendingTx'
import DefaultPricer from './Pricer'

const EtherScanLink = styled(DefaultEtherScanLink)`
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

  background: ${({ editing }) => (editing ? '#F0F6FA' : 'white')};
  padding: ${({ editing }) => (editing ? '20px' : '0')};
  ${({ editing }) => (editing ? `margin-bottom: 20px;` : '')}
  transition: 0.3s;
`

const DetailsContent = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;
  flex-direction: column;
  width: 100%;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
  transition: 0.3s;
  ${mq.small`
    flex-direction: row;
  `}
`

const EditRecord = styled('div')`
  width: 100%;
`

const Input = styled(DefaultInput)`
  margin-bottom: 20px;
`

const Action = styled('div')`
  margin-top: 20px;
  ${mq.small`
    margin-top: 0;
    position: absolute;
    right: 10px;
    top: 50%;
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

function getDefaultMessage(keyName) {
  switch (keyName) {
    case 'Resolver':
      return ['No Resolver set', 'message']
    case 'Controller':
      return ['Not owned yet', 'message']
    default:
      return ['No 0x message set', 'message']
  }
}

function getInputType(
  keyName,
  {
    newValue,
    updateValue,
    isValid,
    isInvalid,
    name,
    ethUsdPriceLoading,
    ethUsdPrice,
    years,
    setYears,
    duration,
    expirationDate
  }
) {
  switch (keyName) {
    case 'Expiration Date':
      return (
        <Pricer
          name={name}
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
    default:
      return (
        <Input
          value={newValue}
          onChange={e => updateValue(e.target.value)}
          valid={isValid}
          invalid={isInvalid}
          placeholder="Type in a new Ethereum address"
          large
        />
      )
  }
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
  keyName,
  value,
  type,
  mutation,
  mutationButton,
  editButton,
  domain,
  variableName,
  refetch,
  confirm
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
        refetch()
      }}
    >
      {mutation => (
        <DetailsEditableContainer editing={editing}>
          <DetailsContent editing={editing}>
            <DetailsKey>{keyName}</DetailsKey>
            <DetailsValue
              editable
              data-testid={`details-value-${keyName.toLowerCase()}`}
            >
              {type === 'address' ? (
                <EtherScanLink address={value}>
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
                </EtherScanLink>
              ) : type === 'date' ? (
                formatDate(value)
              ) : (
                value
              )}
            </DetailsValue>
            {editing ? null : pending && !confirmed ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={() => {
                  refetch()
                  setConfirmed()
                }}
              />
            ) : (
              <Action>
                {editButton ? (
                  <EditButton
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
          <Transition
            items={editing}
            from={{ opacity: 0, height: 0 }}
            enter={{ opacity: 1, height: 'auto' }}
            leave={{ opacity: 0, height: 0 }}
          >
            {editing =>
              editing &&
              (props => (
                <div style={props}>
                  <EditRecord>
                    {getInputType(keyName, {
                      newValue,
                      updateValue,
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
                                updateValue(data.publicResolver.address)
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
                        keyName === 'Expiration Date'
                          ? formatDate(value)
                          : value
                      }
                      newValue={
                        keyName === 'Expiration Date'
                          ? formatDate(expirationDate)
                          : newValue
                      }
                      mutationButton={mutationButton}
                      confirm={confirm}
                      isValid={isValid}
                    />
                  </Buttons>
                </div>
              ))
            }
          </Transition>
        </DetailsEditableContainer>
      )}
    </Mutation>
  )
}

function ViewOnly({ value, keyName, type, deedOwner, isDeedOwner, domain }) {
  if (parseInt(value, 16) === 0) {
    let [newValue, newType] = getDefaultMessage(keyName)
    value = newValue
    type = newType
    if (
      keyName === 'Owner' &&
      domain.parent === 'eth' &&
      parseInt(deedOwner, 16) !== 0
    ) {
      value = 'Pending'
      if (isDeedOwner) {
        value += '(You have not finalised)'
      }
    }
  }
  return (
    <DetailsEditableContainer>
      <DetailsContent>
        <DetailsKey>{keyName}</DetailsKey>
        <DetailsValue data-testid={`details-value-${keyName.toLowerCase()}`}>
          {type === 'address' ? (
            <EtherScanLink address={value}>
              <SingleNameBlockies address={value} imageSize={24} />
              {value}
            </EtherScanLink>
          ) : type === 'date' ? (
            formatDate(value)
          ) : (
            value
          )}
        </DetailsValue>
      </DetailsContent>
    </DetailsEditableContainer>
  )
}

function DetailsEditable(props) {
  return props.canEdit ? <Editable {...props} /> : <ViewOnly {...props} />
}

DetailsEditable.propTypes = {
  keyName: PropTypes.string.isRequired, // key of the record
  value: PropTypes.string.isRequired, // value of the record (normally hex address)
  type: PropTypes.string, // type of value. Defaults to address
  mutation: PropTypes.object.isRequired, //graphql mutation string for making tx
  mutationButton: PropTypes.string, // Mutation button text
  editButton: PropTypes.string, //Edit button text
  canEdit: PropTypes.bool,
  domain: PropTypes.object.isRequired,
  variableName: PropTypes.string, //can change the variable name for mutation
  refetch: PropTypes.func.isRequired
}

export default DetailsEditable

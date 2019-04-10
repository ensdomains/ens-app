import React, { Component } from 'react'
import styled from '@emotion/styled'
import { Mutation, Query } from 'react-apollo'
import { addressUtils } from '@0xproject/utils'
import PropTypes from 'prop-types'
import { Transition } from 'react-spring'
import Tooltip from '../Tooltip/Tooltip'
import { GET_PUBLIC_RESOLVER } from '../../graphql/queries'
import mq from 'mediaQuery'
import { useEditable } from '../hooks'

import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import SaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Button from '../Forms/Button'
import Pencil from '../Forms/Pencil'
import Info from '../Icons/Info'
import DefaultPendingTx from '../PendingTx'

const EtherScanLink = styled(DefaultEtherScanLink)``

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

const Buttons = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

function getDefaultMessage(keyName) {
  switch (keyName) {
    case 'Resolver':
      return ['No Resolver set', 'message']
    case 'Owner':
      return ['Not owned yet', 'message']
    default:
      return ['No 0x message set', 'message']
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

  const isValid = addressUtils.isAddress(newValue)
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
                  {value}
                </EtherScanLink>
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
                    <Input
                      value={newValue}
                      onChange={e => updateValue(e.target.value)}
                      valid={isValid}
                      invalid={isInvalid}
                      placeholder="Type in a new Ethereum address"
                      large
                    />
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
                        const variables = {
                          name: domain.name,
                          [variableName ? variableName : 'address']: newValue
                        }

                        mutation({
                          variables
                        })
                      }}
                      value={value}
                      newValue={newValue}
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

class DetailsEditable extends Component {
  _renderViewOnly() {
    let { value, keyName, type, deedOwner, isDeedOwner } = this.props
    if (parseInt(value, 16) === 0) {
      let [newValue, newType] = getDefaultMessage(keyName)
      value = newValue
      type = newType
      if(keyName === 'Owner' && parseInt(deedOwner, 16) !== 0){
        value = 'Pending'
        if(isDeedOwner){
          value+='(You have not finalised)'
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
            ) : (
              value
            )}
          </DetailsValue>
        </DetailsContent>
      </DetailsEditableContainer>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? <Editable {...this.props} /> : this._renderViewOnly()
  }
}

DetailsEditable.propTypes = {
  keyName: PropTypes.string.isRequired, // key of the record
  value: PropTypes.string.isRequired, // value of the record (normally hex address)
  type: PropTypes.string, // type of value. Defaults to address
  mutation: PropTypes.object.isRequired, //graphql mutation string for making tx
  mutationButton: PropTypes.string, // Mutation button text
  editButton: PropTypes.string, //Edit button text
  domain: PropTypes.object.isRequired,
  variableName: PropTypes.string, //can change the variable name for mutation
  refetch: PropTypes.func.isRequired
}

export default DetailsEditable

import React, { Component } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import { addressUtils } from '@0xproject/utils'
import PropTypes from 'prop-types'
import { Transition } from 'react-spring'

import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import Editable from './Editable'
import SaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Button from '../Forms/Button'
import Pencil from '../Forms/Pencil'
import DefaultPendingTx from '../PendingTx'

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
`

const DetailsEditableContainer = styled(DetailsItem)`
  flex-direction: column;

  background: ${({ editing }) => (editing ? '#F0F6FA' : 'white')};
  padding: ${({ editing }) => (editing ? '20px' : '0')};
  margin-bottom: ${({ editing }) => (editing ? '20px' : '0')};
  transition: 0.3s;
`

const DetailsContent = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
  transition: 0.3s;
`

const EditRecord = styled('div')`
  width: 100%;
`

const Input = styled(DefaultInput)`
  margin-bottom: 20px;
`

const Action = styled('div')`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -65%);
`

const PendingTx = styled(DefaultPendingTx)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -65%);
`

const DefaultResolverButton = styled(Button)`
  margin-right: 20px;
`

const Buttons = styled('div')`
  display: flex;
  justify-content: flex-end;
`

class DetailsEditable extends Component {
  _renderEditable() {
    let {
      keyName,
      value,
      type,
      mutation,
      mutationButton,
      editButton,
      domain,
      variableName,
      refetch,
      publicResolver
    } = this.props
    if (keyName === 'Resolver' && parseInt(value, 16) === 0) {
      value = 'No Resolver Set'
      type = 'message'
    }
    return (
      <Editable>
        {({
          editing,
          startEditing,
          stopEditing,
          newValue,
          updateValue,
          updateValueDirect,
          startPending,
          setConfirmed,
          pending,
          confirmed
        }) => {
          const isValid = addressUtils.isAddress(newValue)
          const isInvalid = !isValid && newValue.length > 0
          return (
            <Mutation
              mutation={mutation}
              onCompleted={data => {
                // const timer = setInterval(() => {
                //   refetch().then(({ data }) => {
                //     if (data.getReverseRecord.name === name) {
                //       clearInterval(timer)
                //       setConfirmed()
                //     }
                //   })
                // }, 2000)
                setConfirmed()
                refetch()
              }}
            >
              {mutation => (
                <DetailsEditableContainer editing={editing}>
                  <DetailsContent editing={editing}>
                    <DetailsKey>{keyName}</DetailsKey>
                    <DetailsValue>
                      {type === 'address' ? (
                        <EtherScanLink address={value}>
                          <SingleNameBlockies address={value} imageSize={24} />
                          {value}
                        </EtherScanLink>
                      ) : (
                        value
                      )}
                    </DetailsValue>
                    {editing ? null : pending && !confirmed ? (
                      <PendingTx />
                    ) : (
                      <Action>
                        {editButton ? (
                          <Button onClick={startEditing}>{editButton}</Button>
                        ) : (
                          <Pencil onClick={startEditing} />
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
                              onChange={updateValue}
                              valid={isValid}
                              invalid={isInvalid}
                              placeholder="Type in a new Ethereum address"
                              large
                            />
                          </EditRecord>
                          <Buttons>
                            {keyName === 'Resolver' && (
                              <DefaultResolverButton
                                onClick={() =>
                                  updateValueDirect(publicResolver.address)
                                }
                              >
                                Use Public Resolver
                              </DefaultResolverButton>
                            )}

                            <SaveCancel
                              stopEditing={stopEditing}
                              mutation={() => {
                                const variables = {
                                  name: domain.name,
                                  [variableName
                                    ? variableName
                                    : 'address']: newValue
                                }

                                mutation({
                                  variables
                                })
                                startPending()
                              }}
                              mutationButton={mutationButton}
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
        }}
      </Editable>
    )
  }

  _renderViewOnly() {
    let { value, keyName, type } = this.props

    if (keyName === 'Resolver' && parseInt(value, 16) === 0) {
      value = 'No Resolver Set'
      type = 'message'
    }
    return (
      <DetailsEditableContainer>
        <DetailsContent>
          <DetailsKey>{keyName}</DetailsKey>
          <DetailsValue>
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
    return isOwner ? this._renderEditable() : this._renderViewOnly()
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

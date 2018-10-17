import React, { Component } from 'react'
import styled from 'react-emotion'
import { addressUtils } from '@0xproject/utils'

import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import Editable from './Editable'
import SaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Button from '../Forms/Button'
import Pencil from '../Forms/Pencil'

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
`

const DetailsEditableContainer = styled(DetailsItem)`
  flex-direction: column;

  background: ${({ editing }) => (editing ? '#F0F6FA' : 'white')};
  padding: ${({ editing }) => (editing ? '20px' : '0')};
  margin-bottom: ${({ editing }) => (editing ? '20px' : '0')};
`

const DetailsContent = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
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

class DetailsEditable extends Component {
  _renderEditable() {
    const {
      keyName,
      value,
      type,
      mutation,
      mutationButton,
      editButton,
      domain,
      variableName
    } = this.props
    return (
      <Editable>
        {({ editing, startEditing, stopEditing, newValue, updateValue }) => (
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
              {editing ? null : (
                <Action>
                  {editButton ? (
                    <Button onClick={startEditing}>{editButton}</Button>
                  ) : (
                    <Pencil onClick={startEditing} />
                  )}
                </Action>
              )}
            </DetailsContent>

            {editing ? (
              <>
                <EditRecord>
                  <Input value={newValue} onChange={updateValue} />
                  {addressUtils.isAddress(newValue) ? 'cool' : null}
                </EditRecord>
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
                  mutationButton={mutationButton}
                />
              </>
            ) : (
              ''
            )}
          </DetailsEditableContainer>
        )}
      </Editable>
    )
  }

  _renderViewOnly() {
    const { value, keyName } = this.props
    return (
      <DetailsEditableContainer>
        <DetailsContent>
          <DetailsKey>{keyName}</DetailsKey>
          <DetailsValue>
            <EtherScanLink address={value}>
              <SingleNameBlockies address={value} imageSize={24} />
              {value}
            </EtherScanLink>
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

export default DetailsEditable

import React, { Component } from 'react'
import styled from 'react-emotion'
import { addressUtils } from '@0xproject/utils'
import { SingleNameBlockies } from './SingleNameBlockies'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import Editable from './Editable'
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
  top: 0;
`

const SaveContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const Save = styled(Button)``

const Cancel = styled(Button)`
  margin-right: 20px;
`

class DetailsEditable extends Component {
  _renderEditable() {
    const {
      keyName,
      value,
      type,
      mutation,
      mutationButton,
      editButton
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
                <SaveContainer>
                  <Cancel type="hollow" onClick={stopEditing}>
                    Cancel
                  </Cancel>
                  <Save onClick={() => {}}>
                    {mutationButton ? mutationButton : 'Save'}
                  </Save>
                </SaveContainer>
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
        <DetailsKey>{keyName}</DetailsKey>
        <DetailsValue>
          <EtherScanLink address={value}>
            <SingleNameBlockies address={value} imageSize={24} />
            {value}
          </EtherScanLink>
        </DetailsValue>
      </DetailsEditableContainer>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? this._renderEditable() : this._renderViewOnly()
  }
}

export default DetailsEditable

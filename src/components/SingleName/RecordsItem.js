import React, { Component } from 'react'
import styled from 'react-emotion'

import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import Input from '../Forms/Input'
import { ReactComponent as Bin } from '../Icons/Pencil.svg'
import Editable from './Editable'

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
`

const RecordsItem = styled(DetailsItem)`
  border-top: 1px dashed #d3d3d3;
  padding: 20px;
`

const RecordsKey = styled(DetailsKey)`
  font-size: 12px;
  margin-bottom: 0;
  width: 200px;
`

const RecordsValue = styled(DetailsValue)`
  font-size: 14px;
`

const EditButton = styled(Bin)``

const EditRecord = styled('div')``

class RecordItem extends Component {
  _renderEditable() {
    const { name, value, type } = this.props
    return (
      <Editable>
        {({ editing, startEditing, stopEditing, newValue }) => (
          <RecordsItem editing={editing}>
            <RecordsKey>{name}</RecordsKey>
            <RecordsValue>
              {type === 'address' ? (
                <EtherScanLink address={value}>{value}</EtherScanLink>
              ) : (
                value
              )}
            </RecordsValue>
            <EditButton onClick={startEditing} />
            {editing ? (
              <EditRecord>
                <Input />
              </EditRecord>
            ) : (
              ''
            )}
          </RecordsItem>
        )}
      </Editable>
    )
  }

  _renderViewOnly() {
    const { name, value, type } = this.props
    return (
      <RecordsItem>
        <RecordsKey>{name}</RecordsKey>
        <RecordsValue>
          {type === 'address' ? (
            <EtherScanLink address={value}>{value}</EtherScanLink>
          ) : (
            value
          )}
        </RecordsValue>
      </RecordsItem>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? this._renderEditable() : this._renderViewOnly()
  }
}

export default RecordItem

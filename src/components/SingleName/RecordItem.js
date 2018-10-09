import React, { Component } from 'react'
import styled from 'react-emotion'

import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'

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

class RecordItem extends Component {
  _renderEditable() {
    const { name, value, type } = this.props
    return (
      <RecordsItem>
        Editable!
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

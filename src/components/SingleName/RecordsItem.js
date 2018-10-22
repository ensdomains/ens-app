import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import DefaultInput from '../Forms/Input'
import Pencil from '../Forms/Pencil'
import Bin from '../Forms/Bin'
import Editable from './Editable'
import SaveCancel from './SaveCancel'

const EtherScanLink = styled(DefaultEtherScanLink)`
  display: flex;
`

const RecordsItem = styled(DetailsItem)`
  border-top: 1px dashed #d3d3d3;
  padding: 20px;
  flex-direction: column;

  background: ${({ editing }) => (editing ? '#F0F6FA' : 'white')};
`

const RecordsContent = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
`

const RecordsKey = styled(DetailsKey)`
  font-size: 12px;
  margin-bottom: 0;
  width: 200px;
`

const RecordsValue = styled(DetailsValue)`
  font-size: 14px;
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

class RecordItem extends Component {
  _renderEditable() {
    const { keyName, value, type, mutation } = this.props

    return (
      <Editable>
        {({ editing, startEditing, stopEditing, newValue, updateValue }) => (
          <RecordsItem editing={editing}>
            <RecordsContent editing={editing}>
              <RecordsKey>{keyName}</RecordsKey>
              <RecordsValue>
                {type === 'address' ? (
                  <EtherScanLink address={value}>{value}</EtherScanLink>
                ) : (
                  value
                )}
              </RecordsValue>
              {editing ? (
                <Action>
                  <Bin />
                </Action>
              ) : (
                <Action>
                  <Pencil onClick={startEditing} />
                </Action>
              )}
            </RecordsContent>

            {editing ? (
              <>
                <EditRecord>
                  <Input onChange={updateValue} />
                </EditRecord>
                <SaveCancel mutation={() => {}} stopEditing={stopEditing} />
              </>
            ) : (
              ''
            )}
          </RecordsItem>
        )}
      </Editable>
    )
  }

  _renderViewOnly() {
    const { keyName, value, type } = this.props
    return (
      <RecordsItem>
        <RecordsContent>
          <RecordsKey>{keyName}</RecordsKey>
          <RecordsValue>
            {type === 'address' ? (
              <EtherScanLink address={value}>{value}</EtherScanLink>
            ) : (
              value
            )}
          </RecordsValue>
        </RecordsContent>
      </RecordsItem>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? this._renderEditable() : this._renderViewOnly()
  }
}

RecordItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  mutation: PropTypes.func
}

export default RecordItem

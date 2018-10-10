import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import Input from '../Forms/Input'
import Button from '../Forms/Button'
import Pencil from '../Forms/Pencil'
import Bin from '../Forms/Bin'
import Editable from './Editable'

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

const Action = styled('div')`
  position: absolute;
  right: 10px;
  top: 0;
`

const SaveContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const Save = styled(Button)`
  margin-right: 20px;
`

const Cancel = styled('div')``

class RecordItem extends Component {
  _renderEditable() {
    const { keyName, value, type, mutation } = this.props
    return (
      <Editable>
        {({ editing, startEditing, stopEditing, newValue, updateValue }) => (
          <RecordsItem editing={editing}>
            <RecordsContent>
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
                <SaveContainer>
                  <Save onClick={() => {}}>Save</Save>
                  <Button type="hollow" onClick={stopEditing}>
                    Cancel
                  </Button>
                </SaveContainer>
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
        <RecordsKey>{keyName}</RecordsKey>
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

RecordItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  mutation: PropTypes.func
}

export default RecordItem

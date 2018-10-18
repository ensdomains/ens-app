import React, { Component } from 'react'
import styled from 'react-emotion'
import Editable from './Editable'
import SaveCancel from './SaveCancel'
import DefaultInput from '../Forms/Input'
import Select from '../Forms/Select'

const ToggleAddRecord = styled('span')`
  font-size: 22px;

  &:hover {
    cursor: pointer;
  }
`

const RecordsTitle = styled('h3')`
  /* Pointers: */
  font-family: Overpass-Bold;
  font-size: 12px;
  color: #adbbcd;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const AddRecordContainer = styled('div')`
  background: #f0f6fa;
`

const AddRecordForm = styled('form')`
  padding: 20px;
`

const Row = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`

const Input = styled(DefaultInput)`
  margin-left: 20px;
`

class AddRecord extends Component {
  _renderEditable() {
    return (
      <AddRecordContainer>
        <Editable>
          {({ editing, startEditing, stopEditing, newValue, updateValue }) => (
            <>
              <RecordsTitle>
                Records
                {!editing ? (
                  <ToggleAddRecord onClick={startEditing}>+</ToggleAddRecord>
                ) : (
                  <ToggleAddRecord onClick={stopEditing}>-</ToggleAddRecord>
                )}
              </RecordsTitle>
              {editing && (
                <AddRecordForm>
                  Add a record
                  <Row>
                    <Select
                      options={[
                        {
                          label: 'Address',
                          value: 'addr'
                        },
                        {
                          label: 'Content',
                          value: 'content'
                        }
                      ]}
                    />
                    <Input value={newValue} onChange={updateValue} />
                  </Row>
                  <SaveCancel stopEditing={stopEditing} mutation={() => {}} />
                </AddRecordForm>
              )}
            </>
          )}
        </Editable>
      </AddRecordContainer>
    )
  }

  _renderViewOnly() {
    return (
      <AddRecordContainer>
        <RecordsTitle>Records</RecordsTitle>
      </AddRecordContainer>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? this._renderEditable() : this._renderViewOnly()
  }
}

export default AddRecord

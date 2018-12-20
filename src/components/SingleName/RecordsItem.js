import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import { validateRecord, getPlaceholder } from '../../utils/records'

import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import AddReverseRecord from './AddReverseRecord'
import DefaultEtherScanLink from '../ExternalLinks/EtherScanLink'
import DefaultInput from '../Forms/Input'
import Pencil from '../Forms/Pencil'
import Bin from '../Forms/Bin'
import Editable from './Editable'
import SaveCancel from './SaveCancel'
import DefaultPendingTx from '../PendingTx'

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

const PendingTx = styled(DefaultPendingTx)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -65%);
`

class RecordItem extends Component {
  _renderEditable() {
    const {
      domain,
      keyName,
      value,
      type,
      mutation,
      refetch,
      variableName,
      account
    } = this.props

    return (
      <Editable>
        {({
          editing,
          startEditing,
          stopEditing,
          newValue,
          updateValue,
          startPending,
          txHash,
          setConfirmed,
          pending,
          confirmed
        }) => {
          const isValid = validateRecord({ type, value: newValue })
          const isInvalid =
            !isValid && newValue.length > 0 && type === 'address'
          return (
            <>
              <Mutation
                mutation={mutation}
                onCompleted={data => {
                  startPending(data.setAddress)
                  refetch()
                }}
              >
                {mutation => (
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

                      {pending && !confirmed && txHash ? (
                        <PendingTx
                          txHash={txHash}
                          setConfirmed={setConfirmed}
                        />
                      ) : editing ? (
                        <Action>
                          <Bin />
                        </Action>
                      ) : (
                        <Action>
                          <Pencil
                            onClick={startEditing}
                            data-testid={`edit-${keyName.toLowerCase()}`}
                          />
                        </Action>
                      )}
                    </RecordsContent>

                    {editing ? (
                      <>
                        <EditRecord>
                          <Input
                            placeholder={getPlaceholder(type)}
                            onChange={updateValue}
                            valid={isValid}
                            invalid={isInvalid}
                          />
                        </EditRecord>
                        <SaveCancel
                          mutation={() => {
                            const variables = {
                              name: domain.name,
                              [variableName
                                ? variableName
                                : 'recordValue']: newValue
                            }
                            mutation({
                              variables
                            })
                          }}
                          isValid={type === 'address' ? isValid : true}
                          stopEditing={stopEditing}
                        />
                      </>
                    ) : (
                      ''
                    )}
                    {keyName === 'Address' && (
                      <AddReverseRecord account={account} name={domain.name} />
                    )}
                  </RecordsItem>
                )}
              </Mutation>
            </>
          )
        }}
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
  keyName: PropTypes.string.isRequired, // key of the record
  value: PropTypes.string.isRequired, // value of the record (normally hex address)
  type: PropTypes.string, // type of value. Defaults to address
  mutation: PropTypes.object.isRequired, //graphql mutation string for making tx
  mutationButton: PropTypes.string, // Mutation button text
  editButton: PropTypes.string, //Edit button text
  domain: PropTypes.object.isRequired,
  variableName: PropTypes.string, //can change the variable name for mutation
  refetch: PropTypes.func.isRequired,
  account: PropTypes.string
}

export default RecordItem

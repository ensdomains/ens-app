import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import { validateRecord } from '../../utils/records'
import { emptyAddress } from '../../utils/utils'

import { DetailsItem, DetailsKey, DetailsValue } from './DetailsItem'
import AddReverseRecord from './AddReverseRecord'
import EtherScanLink from '../ExternalLinks/EtherScanLink'
import ContentHashLink from '../ExternalLinks/ContentHashLink'
import Pencil from '../Forms/Pencil'
import Bin from '../Forms/Bin'
import SaveCancel from './SaveCancel'
import DefaultPendingTx from '../PendingTx'
import { SET_CONTENT, SET_OLDCONTENT, SET_ADDRESS } from '../../graphql/mutations'
import DetailsItemInput from './DetailsItemInput'
import { useEditable } from '../hooks'

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

function chooseMutation(recordType, contentType) {
  switch (recordType) {
    case 'Content':
      if(contentType === 'oldcontent'){
        return SET_OLDCONTENT
      }else{
        return SET_CONTENT
      }
    case 'Address':
      return SET_ADDRESS
    default:
      throw new Error('Not a recognised record type')
  }
}

const Actionable = ({
  startEditing,
  keyName,
  value
}) => {
  if(value && !value.error){
    return(
      <Action>
        <Pencil
          onClick={startEditing}
          data-testid={`edit-${keyName.toLowerCase()}`}
        />
      </Action>
    )
  }
}

const Editable = ({
  domain,
  keyName,
  value,
  type,
  mutation,
  refetch,
  variableName,
  account
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
  const isValid = validateRecord({ type, value: newValue, contentType:domain.contentType })
  const isInvalid = !isValid && newValue.length > 0 && type === 'address'

  return (
    <>
      <Mutation
        mutation={mutation}
        onCompleted={data => {
          startPending(Object.values(data)[0])
          refetch()
        }}
      >
        {mutation => (
          <RecordsItem editing={editing}>
            <RecordsContent editing={editing}>
              <RecordsKey>{keyName}</RecordsKey>
              <RecordsValue editableSmall>
                {type === 'address' ? (
                  <EtherScanLink address={value}>{value}</EtherScanLink>
                ) : 
                  <ContentHashLink value={value} contentType={domain.contentType} />
                }
              </RecordsValue>

              {pending && !confirmed && txHash ? (
                <PendingTx
                  txHash={txHash}
                  setConfirmed={setConfirmed}
                  refetch={refetch}
                />
              ) : editing ? (
                <Action>
                  <Mutation
                    mutation={chooseMutation(keyName, domain.contentType)}
                    variables={{
                      name: domain.name,
                      recordValue: emptyAddress
                    }}
                    onCompleted={data => {
                      startPending(Object.values(data)[0])
                    }}
                  >
                    {mutate => (
                      <Bin
                        onClick={e => {
                          e.preventDefault()
                          mutate()
                        }}
                      />
                    )}
                  </Mutation>
                </Action>
              ) : <Actionable startEditing={startEditing} keyName={keyName} value={value} />}
            </RecordsContent>
            {editing ? (
              <>
                <EditRecord>
                  <DetailsItemInput 
                    newValue={newValue}
                    dataType={type}
                    contentType={domain.contentType}
                    updateValue={updateValue}
                    isValid={isValid}
                    isInvalid={isInvalid}
                  />
                </EditRecord>
                <SaveCancel
                  oldcontentWarning={ type === 'content' && domain.contentType === 'oldcontent'}
                  mutation={() => {
                    const variables = {
                      name: domain.name,
                      [variableName ? variableName : 'recordValue']: newValue
                    }
                    mutation({
                      variables
                    })
                  }}
                  isValid={isValid}
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
}

class RecordItem extends Component {
  _renderViewOnly() {
    const { keyName, value, type, domain } = this.props
    return (
      <RecordsItem>
        <RecordsContent>
          <RecordsKey>{keyName}</RecordsKey>
          <RecordsValue>
            {type === 'address' ? (
              <EtherScanLink address={value}>{value}</EtherScanLink>
            ) :(
              <ContentHashLink value = {value} contentType={domain.contentType  } />
            )}
          </RecordsValue>
        </RecordsContent>
      </RecordsItem>
    )
  }
  render() {
    const { isOwner } = this.props
    return isOwner ? <Editable {...this.props} /> : this._renderViewOnly()
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

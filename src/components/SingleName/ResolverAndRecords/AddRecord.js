import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import mq from 'mediaQuery'

import { validateRecord } from '../../../utils/records'
import { useEditable } from '../../hooks'
import {
  SET_CONTENT,
  SET_CONTENTHASH,
  SET_ADDRESS,
  SET_ADDR,
  SET_TEXT
} from '../../../graphql/mutations'
import { getOldContentWarning } from './warnings'
import TEXT_RECORD_KEYS from 'constants/textRecords'
import COIN_LIST from 'constants/coinList'

import Upload from '../../IPFS/Upload'
import IpfsLogin from '../../IPFS/Login'
import Button from '../../Forms/Button'
import ContentHashLink from '../../Links/ContentHashLink'
import { DetailsKey } from '../DetailsItem'
import DetailsItemInput from '../DetailsItemInput'
import { SaveCancel, SaveCancelSwitch } from '../SaveCancel'
import DefaultSelect from '../../Forms/Select'
import PendingTx from '../../PendingTx'
import DefaultAddressInput from '@ensdomains/react-ens-address'

const AddressInput = styled(DefaultAddressInput)`
  margin-bottom: 10px;
`

const ToggleAddRecord = styled('span')`
  font-size: 22px;

  &:hover {
    cursor: pointer;
  }
`

const Select = styled(DefaultSelect)`
  margin-right: 20px;
  flex-direction: row;
  margin-bottom: 10px;
  width: 100%;
  ${mq.small`
    margin-bottom: 0px;
    max-width: 150px;
  `}
`

const RecordsTitle = styled('h3')`
  /* Pointers: */
  font-family: Overpass;
  font-weight: 700;
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
  flex-direction: column;
  ${mq.small`
    flex-direction: row;
  `}
`

const NewRecordsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 21px;
  overflow: hidden;
  ${mq.medium`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `}
`

export const RecordsKey = styled(DetailsKey)`
  font-size: 12px;
  margin-bottom: 0;
  max-width: 100%;
  margin-right: 10px;
  ${mq.medium`
    width: 200px;
    margin-right: 0px;
  `}
`
const UploadBtn = styled(Button)`
  flex-direction: row;
  margin-bottom: 5px;
  width: 100%;
  ${mq.small`
  margin-left: 20px;  
  margin-bottom: 20px;
  max-width: 150px;
`}
`

function chooseMutation(recordType, contentType) {
  switch (recordType.value) {
    case 'content':
      if (contentType === 'oldcontent') {
        return SET_CONTENT
      } else {
        return SET_CONTENTHASH
      }
    case 'address':
      return SET_ADDRESS
    case 'otherAddresses':
      return SET_ADDR
    case 'text':
      return SET_TEXT
    default:
      throw new Error('Not a recognised record type')
  }
}

function TextRecordInput({
  selectedRecord,
  updateValue,
  newValue,
  selectedKey,
  setSelectedKey,
  isValid,
  isInvalid
}) {
  return (
    <>
      <Select
        selectedRecord={selectedKey}
        handleChange={setSelectedKey}
        placeholder="Key"
        addNewKey={true}
        options={TEXT_RECORD_KEYS.map(key => ({
          label: key,
          value: key
        }))}
      />
      <DetailsItemInput
        newValue={newValue}
        dataType={selectedRecord ? selectedRecord.value : null}
        updateValue={updateValue}
        isValid={isValid}
        isInvalid={isInvalid}
        placeholder={selectedKey ? `Enter ${selectedKey.value}` : ''}
      />
    </>
  )
}

function AddressRecordInput({
  selectedRecord,
  updateValue,
  newValue,
  selectedKey,
  setSelectedKey,
  isValid,
  isInvalid
}) {
  return (
    <>
      <Select
        selectedRecord={selectedKey}
        handleChange={setSelectedKey}
        placeholder="Coin"
        options={COIN_LIST.map(key => ({
          label: key,
          value: key
        }))}
      />
      <DetailsItemInput
        newValue={newValue}
        dataType={selectedRecord ? selectedRecord.value : null}
        updateValue={updateValue}
        isValid={isValid}
        isInvalid={isInvalid}
        placeholder={selectedKey ? `Enter a ${selectedKey.value} address` : ''}
      />
    </>
  )
}

function Editable({ domain, emptyRecords, refetch, setRecordAdded }) {
  const [selectedRecord, selectRecord] = useState(null)
  const [selectedKey, setSelectedKey] = useState(null)
  const { state, actions } = useEditable()

  const handleChange = selectedRecord => {
    selectRecord(selectedRecord)
  }

  const handleSubmit = e => {
    e.preventDefault()
  }

  const {
    editing,
    uploading,
    authorized,
    newValue,
    txHash,
    pending,
    confirmed
  } = state

  const {
    startEditing,
    stopEditing,
    startUploading,
    stopUploading,
    startAuthorizing,
    stopAuthorizing,
    updateValue,
    startPending,
    setConfirmed
  } = actions

  const isValid = validateRecord({
    type: selectedRecord && selectedRecord.value ? selectedRecord.value : null,
    value: newValue,
    contentType: domain.contentType,
    selectedKey: selectedKey && selectedKey.value
  })

  const isInvalid = newValue !== '' && !isValid
  return (
    <>
      <RecordsTitle>
        Records
        {emptyRecords.length > 0 ? (
          !editing ? (
            pending && !confirmed ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={() => {
                  setConfirmed()
                  refetch()
                  if (selectedKey) {
                    setRecordAdded(selectedKey.value)
                  }
                }}
              />
            ) : (
              <ToggleAddRecord onClick={startEditing}>+</ToggleAddRecord>
            )
          ) : (
            <ToggleAddRecord onClick={stopEditing}>-</ToggleAddRecord>
          )
        ) : null}
      </RecordsTitle>
      {editing && (
        <AddRecordForm onSubmit={handleSubmit}>
          <Row>
            <Select
              selectedRecord={selectedRecord}
              handleChange={handleChange}
              placeholder="Select a record"
              options={emptyRecords}
            />
            {selectedRecord && selectedRecord.value === 'otherAddresses' ? (
              <AddressRecordInput
                selectedRecord={selectedRecord}
                newValue={newValue}
                updateValue={updateValue}
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey}
                isValid={isValid}
                isInvalid={isInvalid}
              />
            ) : selectedRecord &&
              uploading &&
              authorized &&
              selectedRecord.value === 'content' ? (
              <Upload updateValue={updateValue} newValue={newValue} />
            ) : selectedRecord &&
              uploading &&
              !authorized &&
              selectedRecord.value === 'content' ? (
              <IpfsLogin startAuthorizing={startAuthorizing} />
            ) : selectedRecord && selectedRecord.value === 'content' ? (
              <>
                <DetailsItemInput
                  newValue={newValue}
                  dataType={selectedRecord ? selectedRecord.value : null}
                  contentType={domain.contentType}
                  updateValue={updateValue}
                  isValid={isValid}
                  isInvalid={isInvalid}
                />
                <UploadBtn
                  data-testid="upload"
                  type="hollow"
                  onClick={startUploading}
                >
                  New Upload
                </UploadBtn>
              </>
            ) : selectedRecord && selectedRecord.value === 'address' ? (
              <AddressInput
                provider={window.ethereum || window.web3}
                onResolve={({ address }) => {
                  if (address) {
                    updateValue(address)
                  } else {
                    updateValue('')
                  }
                }}
              />
            ) : selectedRecord && selectedRecord.value === 'text' ? (
              <TextRecordInput
                selectedRecord={selectedRecord}
                newValue={newValue}
                updateValue={updateValue}
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey}
                isValid={isValid}
                isInvalid={isInvalid}
              />
            ) : (
              <DetailsItemInput
                newValue={newValue}
                dataType={selectedRecord ? selectedRecord.value : null}
                contentType={domain.contentType}
                updateValue={updateValue}
                isValid={isValid}
                isInvalid={isInvalid}
              />
            )}
          </Row>
          {selectedRecord &&
            uploading &&
            authorized &&
            selectedRecord.value === 'content' &&
            newValue !== '' && (
              <NewRecordsContainer>
                <RecordsKey>New IPFS Hash:</RecordsKey>
                <ContentHashLink
                  value={newValue}
                  contentType={domain.contentType}
                />
              </NewRecordsContainer>
            )}
          {uploading && !authorized && selectedRecord.value === 'content' ? (
            <SaveCancel stopEditing={stopUploading} disabled />
          ) : selectedRecord ? (
            <Mutation
              mutation={chooseMutation(selectedRecord, domain.contentType)}
              variables={{
                name: domain.name,
                recordValue: newValue,
                key: selectedKey && selectedKey.value
              }}
              onCompleted={data => {
                startPending(Object.values(data)[0])
              }}
            >
              {mutate => (
                <>
                  {uploading &&
                  authorized &&
                  selectedRecord.value === 'content' ? (
                    <SaveCancelSwitch
                      warningMessage={getOldContentWarning(
                        selectedRecord.value,
                        domain.contentType
                      )}
                      mutation={e => {
                        e.preventDefault()
                        mutate().then(() => {
                          refetch()
                        })
                      }}
                      isValid={isValid}
                      newValue={newValue}
                      startUploading={startUploading}
                      stopUploading={stopUploading}
                      stopAuthorizing={stopAuthorizing}
                    />
                  ) : (
                    <SaveCancel
                      warningMessage={getOldContentWarning(
                        selectedRecord.value,
                        domain.contentType
                      )}
                      isValid={isValid}
                      stopEditing={() => {
                        stopEditing()
                        selectRecord(null)
                      }}
                      mutation={e => {
                        e.preventDefault()
                        mutate().then(() => {
                          refetch()
                        })
                      }}
                    />
                  )}
                </>
              )}
            </Mutation>
          ) : (
            <SaveCancel stopEditing={stopEditing} disabled />
          )}
        </AddRecordForm>
      )}
    </>
  )
}

function AddRecord(props) {
  const { canEdit } = props
  return canEdit ? (
    <AddRecordContainer>
      <Editable {...props} />
    </AddRecordContainer>
  ) : (
    <AddRecordContainer>
      <RecordsTitle>Records</RecordsTitle>
    </AddRecordContainer>
  )
}

export default AddRecord

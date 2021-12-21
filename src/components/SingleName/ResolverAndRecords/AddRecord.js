import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'
import { useTranslation } from 'react-i18next'

import { validateRecord, getPlaceholder } from '../../../utils/records'
import { useEditable } from '../../hooks'
import TEXT_RECORD_KEYS from 'constants/textRecords'
import COIN_LIST from 'constants/coinList'

import Button from '../../Forms/Button'
import { DetailsKey } from '../DetailsItem'
import DetailsItemInput from '../DetailsItemInput'
import DefaultSelect from '../../Forms/Select'
import DefaultAddressInput from '@ensdomains/react-ens-address'
import { asyncThrottle } from 'utils/utils'

const AddressInput = styled(DefaultAddressInput)`
  margin-bottom: 10px;
`

const ToggleAddRecord = styled('span')`
  font-family: Overpass;
  font-weight: bold;
  font-size: 14px;
  color: #5284ff;
  letter-spacing: 0.58px;
  text-align: center;

  &:hover {
    cursor: pointer;
  }

  ${p =>
    p.pending &&
    `
    color: #cccccc;
    pointer-events: none;
    
    &:hover {
      cursor: initial;
    }
  `}
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
  background: #5284ff;
  ${mq.small`
    margin-left: 20px;
    margin-bottom: 20px;
    max-width: 150px;
  `}
`

const AddRecordButton = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const textRecordOptions = TEXT_RECORD_KEYS.slice()
  .sort()
  .map(key => ({
    label: key,
    value: key
  }))
const coinOptions = COIN_LIST.slice()
  .sort()
  .map(key => ({
    label: key,
    value: key
  }))

const clearInput = (setSelectedRecord, setSelectedKey, updateValue) => {
  setSelectedRecord(null)
  setSelectedKey(null)
  updateValue(null)
}

const throttledValidate = asyncThrottle(
  async (selectedKey, newValue, selectedRecord, domain, setIsValidating) => {
    if (!selectedKey) return false
    setIsValidating(true)

    return await validateRecord({
      key: selectedKey?.value,
      value: newValue,
      contractFn: selectedRecord?.contractFn,
      addr: domain.addr
    })
  },
  500
)

const useChangedValidRecord = (
  selectedKey,
  newValue,
  selectedRecord,
  domain,
  setIsValidating,
  setIsValid
) => {
  const newValueRef = useRef()

  newValueRef.current = newValue

  useEffect(() => {
    if (newValue) {
      new Promise(async () => {
        const isValid = await throttledValidate(
          selectedKey,
          newValue,
          selectedRecord,
          domain,
          setIsValidating
        )

        if (newValue === newValueRef.current) {
          setIsValid(isValid)
          setIsValidating(false)
        }
      })
    }
  }, [newValue])
}

function Editable({
  domain,
  emptyRecords,
  editing,
  startEditing,
  stopEditing,
  updateRecord,
  pending
}) {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const { newValue } = state
  const { updateValue } = actions

  const [selectedRecord, setSelectedRecord] = useState(null)
  const [selectedKey, setSelectedKey] = useState(null)
  const [isValid, setIsValid] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const handleChange = selectedRecord => {
    if (selectedRecord.contractFn === 'setContenthash') {
      setSelectedKey('content')
    } else {
      setSelectedKey(null)
    }
    setSelectedRecord(selectedRecord)
  }

  const handleSubmit = e => {
    e.preventDefault()
  }

  const args = {
    type: selectedRecord && selectedRecord.value ? selectedRecord.value : null,
    value: newValue,
    contentType: domain.contentType,
    selectedKey: selectedKey && selectedKey.value
  }

  useChangedValidRecord(
    selectedKey,
    newValue,
    selectedRecord,
    domain,
    setIsValidating,
    setIsValid
  )

  return (
    <>
      <RecordsTitle>
        {t('singleName.record.title')}
        {editing ? (
          <ToggleAddRecord onClick={stopEditing} pending={pending}>
            Close Add/Edit Record
          </ToggleAddRecord>
        ) : (
          <ToggleAddRecord onClick={startEditing} pending={pending}>
            Add/Edit Record
          </ToggleAddRecord>
        )}
      </RecordsTitle>
      {editing && (
        <AddRecordForm onSubmit={handleSubmit}>
          <Row>
            <Select
              selectedOption={selectedRecord}
              handleChange={handleChange}
              placeholder="Add record"
              options={emptyRecords}
            />
            {selectedRecord?.value === 'coins' && (
              <Select
                selectedRecord={selectedKey}
                handleChange={setSelectedKey}
                placeholder="Coin"
                options={coinOptions}
              />
            )}
            {selectedRecord?.value === 'textRecords' && (
              <Select
                selectedRecord={selectedKey}
                handleChange={setSelectedKey}
                placeholder="Key"
                options={textRecordOptions}
                addNewKey
              />
            )}
            {selectedRecord?.value && (
              <DetailsItemInput
                newValue={newValue || ''}
                dataType={selectedRecord ? selectedRecord.value : null}
                contentType={selectedKey?.label}
                updateValue={updateValue}
                isValid={isValid && !isValidating}
                isInvalid={!isValid && !isValidating}
                placeholder={getPlaceholder(
                  selectedRecord.contractFn,
                  selectedKey?.label
                )}
              />
            )}
          </Row>
          <AddRecordButton>
            <Button
              data-testid="save-record"
              type={isValid ? 'primary' : 'disabled'}
              disabled={!isValid && !isValidating}
              onClick={() => {
                updateRecord({
                  key: selectedKey?.value || 'CONTENT',
                  value: newValue,
                  contractFn: selectedRecord?.contractFn
                })
                clearInput(setSelectedRecord, setSelectedKey, updateValue)
                setIsValid(false)
                setIsValidating(false)
              }}
            >
              Save
            </Button>
          </AddRecordButton>
        </AddRecordForm>
      )}
    </>
  )
}

function AddRecord(props) {
  const { canEdit } = props
  const { t } = useTranslation()
  return canEdit ? (
    <AddRecordContainer>
      <Editable {...props} />
    </AddRecordContainer>
  ) : (
    <AddRecordContainer>
      <RecordsTitle>{t('singleName.record.title')}</RecordsTitle>
    </AddRecordContainer>
  )
}

export default AddRecord

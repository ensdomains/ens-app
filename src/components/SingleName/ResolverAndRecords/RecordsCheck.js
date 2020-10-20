import React from 'react'
import styled from '@emotion/styled'
import {
  ViewOnly as KeyValueViewOnly,
  KeyValueContainer as DefaultKeyValueContainer,
  KeyValuesList as DefaultKeyValuesList,
  Key as DefaultKey
} from './KeyValueRecord/'

import { RecordsValue } from './ContentHash.js'
import { isRecordEmpty } from '../../../utils/utils'

const Key = styled(DefaultKey)``

const KeyValuesList = styled(DefaultKeyValuesList)``

const KeyValueContainer = styled(DefaultKeyValueContainer)`
  padding: 0;
`

const Contenthash = styled('div')`
  display: flex;
`

const Delete = styled('span')`
  color: red;
`

export default function MultipleRecordsCheck({ changedRecords }) {
  return (
    <div>
      {changedRecords.coins.length > 0 && (
        <KeyValueContainer>
          <Key>Addresses</Key>
          <KeyValuesList>
            {changedRecords.coins.map(record =>
              record.value === '' ? (
                <KeyValueViewOnly
                  textKey={record.key}
                  value={record.value}
                  remove={true}
                />
              ) : (
                <KeyValueViewOnly textKey={record.key} value={record.value} />
              )
            )}
          </KeyValuesList>
        </KeyValueContainer>
      )}

      {changedRecords.contentHash && (
        <Contenthash>
          <Key>Content Hash</Key>
          <RecordsValue>
            {isRecordEmpty(changedRecords.contentHash) ? (
              <Delete>Delete Record</Delete>
            ) : (
              changedRecords.contentHash
            )}
          </RecordsValue>
        </Contenthash>
      )}
      {changedRecords.textRecords.length > 0 && (
        <KeyValueContainer>
          <Key>Text Records</Key>
          <KeyValuesList>
            {changedRecords.textRecords.map(record =>
              record.value === '' ? (
                <KeyValueViewOnly
                  textKey={record.key}
                  value={record.value}
                  remove={true}
                />
              ) : (
                <KeyValueViewOnly textKey={record.key} value={record.value} />
              )
            )}
          </KeyValuesList>
        </KeyValueContainer>
      )}
    </div>
  )
}

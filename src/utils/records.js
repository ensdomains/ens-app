import { addressUtils } from '@0xproject/utils'

export function validateRecord(record) {
  const { type, value } = record
  if (!record.type) {
    return false
  }

  console.log(record)

  switch (type) {
    case 'address':
      return addressUtils.isAddress(value)
    case 'content':
      return true
    default:
      throw new Error('Unrecognised record type')
  }
}

export function selectPlaceholder(selectedRecord) {
  /* Guard against null */
  if (!selectedRecord) {
    return ''
  }
  switch (selectedRecord.value) {
    case 'address':
      return 'Enter an Ethereum address'
    case 'content':
      return 'Enter a content hash'
    default:
      return ''
  }
}

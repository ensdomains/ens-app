import { addressUtils } from '@0xproject/utils'

export function validateRecord(record) {
  if (!record.type) {
    return false
  }

  const { type, value } = record

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

export function getPlaceholder(recordType) {
  switch (recordType) {
    case 'address':
      return 'Enter an Ethereum address'
    case 'content':
      return 'Enter a content hash'
    default:
      return ''
  }
}

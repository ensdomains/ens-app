import { addressUtils } from '@0xproject/utils'
import { validateContent } from './contents'
export function validateRecord(record) {
  if (!record.type) {
    return false
  }

  const { type, value } = record

  switch (type) {
    case 'address':
      return addressUtils.isAddress(value)
    case 'content':
      return validateContent(value)
    default:
      throw new Error('Unrecognised record type')
  }
}

export function getPlaceholder(recordType) {
  switch (recordType) {
    case 'address':
      return 'Enter an Ethereum address'
    case 'content':
      return 'Enter a conent hash (eg: ifpfs://..., bzz://...)'
    default:
      return ''
  }
}

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

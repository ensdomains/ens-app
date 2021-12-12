import { addressUtils } from '@0xproject/utils'
import { validateContent } from './contents'
export function validateRecord(record) {
  if (!record.type) {
    return false
  }

  const { type, value } = record

  if (type == 'content' && record.contentType === 'oldcontent') {
    return value.length > 32
  }

  switch (type) {
    case 'address':
      return addressUtils.isAddress(value)
    case 'content':
      return validateContent(value)
    default:
      throw new Error('Unrecognised record type')
  }
}

export function getPlaceholder(recordType, contentType) {
  switch (recordType) {
    case 'address':
      return 'Enter an Ethereum address'
    case 'content':
      if (contentType === 'contenthash') {
        return 'Enter a content hash (eg: ipfs://..., bzz://..., onion://..., onion3://..., sia://..., arweave://...)'
      } else {
        return 'Enter a content'
      }
    default:
      return ''
  }
}

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

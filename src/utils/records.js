import { encodeContenthash } from '@ensdomains/ui'
import { validateContent } from './contents'
import { addressUtils } from 'utils/utils'

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
      const isAddress = addressUtils.isAddress(value)
      return isAddress
    case 'content':
      const encoded = encodeContenthash(value)
      if (encoded) {
        return validateContent(encoded)
      } else {
        return false
      }
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
        return 'Enter a content hash (eg: ipfs://..., bzz://...)'
      } else {
        return 'Enter a content'
      }
    default:
      return ''
  }
}

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

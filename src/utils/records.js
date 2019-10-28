import { encodeContenthash, isValidContenthash } from '@ensdomains/ui'
import { addressUtils } from 'utils/utils'
import { formatsByName } from '@ensdomains/address-encoder'

export function validateRecord({ type, value, contentType, selectedKey }) {
  if (!type) return false
  if (type === 'content' && contentType === 'oldcontent') {
    return value.length > 32
  }

  switch (type) {
    case 'address':
      const isAddress = addressUtils.isAddress(value)
      return isAddress
    case 'content':
      const encoded = encodeContenthash(value)
      if (encoded) {
        return isValidContenthash(encoded)
      } else {
        return false
      }
    case 'text':
      return true
    case 'otherAddresses':
      if (value === '') return false
      try {
        formatsByName[selectedKey].decoder(value)
        return true
      } catch {
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
        return 'Enter a content hash (eg: /ipfs/..., ipfs://..., bzz://..., onion://..., onion3://...)'
      } else {
        return 'Enter a content'
      }
    default:
      return ''
  }
}

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

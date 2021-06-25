import { encodeContenthash, isValidContenthash } from '@ensdomains/ui'
import { addressUtils } from 'utils/utils'
import { formatsByName } from '@ensdomains/address-encoder'

export function validateRecord({
  key,
  value,
  contentType,
  selectedKey,
  contractFn
}) {
  if (!value) return true
  switch (contractFn) {
    case 'address':
      const isAddress = addressUtils.isAddress(value)
      return isAddress
    case 'setContenthash':
      if (value === EMPTY_ADDRESS) return true // delete record
      const { encoded, error: encodeError } = encodeContenthash(value)
      if (!encodeError && encoded) {
        const test = isValidContenthash(encoded)
        console.log('test: ', test)
        return isValidContenthash(encoded)
      } else {
        return false
      }
    case 'setText':
      return true
    case 'setAddr(bytes32,address)':
      if (value === '') return false
      if (key === 'ETH') {
        return addressUtils.isAddress(value)
      }
      try {
        formatsByName[key].decoder(value)
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
        return 'Enter a content hash (eg: /ipfs/..., ipfs://..., /ipns/..., ipns://..., bzz://..., onion://..., onion3://..., sia://...)'
      } else {
        return 'Enter a content'
      }
    default:
      return ''
  }
}

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

export function isEmptyAddress(address) {
  return parseInt(address) === 0
}

export const createRecord = (contractFn, key, value) => ({
  contractFn,
  key,
  value
})

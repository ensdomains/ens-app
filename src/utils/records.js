import { encodeContenthash, isValidContenthash } from '@ensdomains/ui'
import { addressUtils, supportedAvatarProtocols } from 'utils/utils'
import { formatsByName } from '@ensdomains/address-encoder'
import validateTokenURI from 'api/avatar'

export function validateRecord({ key, value, contractFn, addr }) {
  if (!value) return true
  switch (contractFn) {
    case 'setContenthash':
      if (value === EMPTY_ADDRESS) return true // delete record
      const { encoded, error: encodeError } = encodeContenthash(value)
      if (!encodeError && encoded) {
        return isValidContenthash(encoded)
      } else {
        return false
      }
    case 'setText':
      if (key !== 'avatar') return true
      const protocol = supportedAvatarProtocols.find(proto =>
        value.startsWith(proto)
      )
      if (!protocol) return false
      if (protocol === 'eip155') return validateTokenURI(value, addr)
      return true
    case 'setAddr(bytes32,uint256,bytes)':
      if (value === '') return false
      if (key === 'ETH') {
        return addressUtils.isAddress(value)
      }
      if (key.match(/_LEGACY/)) {
        return false
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
    case 'setAddr(bytes32,uint256,bytes)':
      return contentType
        ? `Enter a ${contentType} address`
        : 'Please select a coin'
    case 'setContenthash':
      return 'Enter a content hash (eg: /ipfs/..., ipfs://..., /ipns/..., ipns://..., bzz://..., onion://..., onion3://..., sia://..., arweave://...)'
    case 'setText':
      return contentType ? `Enter ${contentType}` : 'Please select a key'
    default:
      return ''
  }
}

export const trimRecord = (key, value) => {
  const untrimmedRecordTypes = [
    'description',
    'notice',
    'keywords',
    'name',
    'location'
  ]
  if (untrimmedRecordTypes.every(type => type !== key)) {
    return value.trim()
  }
  return value
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

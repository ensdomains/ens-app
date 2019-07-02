import {
  getNetworkId,
  validateName as _validateName,
  parseSearchTerm as _parseSearchTerm,
  ensStartBlock as _ensStartBlock,
  // isLabelValid as _isLabelValid,
  emptyAddress as _emptyAddress
} from '@ensdomains/ui'
import * as jsSHA3 from 'js-sha3'

//import { checkLabelHash } from '../updaters/preImageDB'

// From https://github.com/0xProject/0x-monorepo/blob/development/packages/utils/src/address_utils.ts

const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/
const ADDRESS_LENGTH = 40

export const addressUtils = {
  isChecksumAddress(address) {
    // Check each case
    const unprefixedAddress = address.replace('0x', '')
    const addressHash = jsSHA3.keccak256(unprefixedAddress.toLowerCase())

    for (let i = 0; i < ADDRESS_LENGTH; i++) {
      // The nth letter should be uppercase if the nth digit of casemap is 1
      const hexBase = 16
      const lowercaseRange = 7
      if (
        (parseInt(addressHash[i], hexBase) > lowercaseRange &&
          unprefixedAddress[i].toUpperCase() !== unprefixedAddress[i]) ||
        (parseInt(addressHash[i], hexBase) <= lowercaseRange &&
          unprefixedAddress[i].toLowerCase() !== unprefixedAddress[i])
      ) {
        return false
      }
    }
    return true
  },
  isAddress(address) {
    if (!BASIC_ADDRESS_REGEX.test(address)) {
      // Check if it has the basic requirements of an address
      return false
    } else if (SAME_CASE_ADDRESS_REGEX.test(address)) {
      // If it's all small caps or all all caps, return true
      return true
    } else {
      // Otherwise check each case
      const isValidChecksummedAddress = addressUtils.isChecksumAddress(address)
      return isValidChecksummedAddress
    }
  }
}

export const uniq = (a, param) =>
  a.filter(
    (item, pos) => a.map(mapItem => mapItem[param]).indexOf(item[param]) === pos
  )

export async function getEtherScanAddr() {
  const networkId = await getNetworkId()
  switch (networkId) {
    case 1:
    case '1':
      return 'https://etherscan.io/'
    case 3:
    case '3':
      return 'https://ropsten.etherscan.io/'
    case 4:
    case '4':
      return 'https://rinkeby.etherscan.io/'
    default:
      return 'https://etherscan.io/'
  }
}

export async function ensStartBlock() {
  return _ensStartBlock()
}

export const checkLabels = (...labelHashes) => labelHashes.map(hash => null)

// export const checkLabels = (...labelHashes) =>
//   labelHashes.map(labelHash => checkLabelHash(labelHash) || null)

export const mergeLabels = (labels1, labels2) =>
  labels1.map((label, index) => (label ? label : labels2[index]))

export function validateName(name) {
  return _validateName(name)
}

export function isLabelValid(name) {
  // return _isLabelValid(name)
}

export const parseSearchTerm = term => {
  return _parseSearchTerm(term)
}

export function modulate(value, rangeA, rangeB, limit) {
  let fromHigh, fromLow, result, toHigh, toLow
  if (limit == null) {
    limit = false
  }
  fromLow = rangeA[0]
  fromHigh = rangeA[1]
  toLow = rangeB[0]
  toHigh = rangeB[1]
  result = toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow)
  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) {
        return toLow
      }
      if (result > toHigh) {
        return toHigh
      }
    } else {
      if (result > toLow) {
        return toLow
      }
      if (result < toHigh) {
        return toHigh
      }
    }
  }
  return result
}

export function isElementInViewport(el) {
  var rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /*or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /*or $(window).width() */
  )
}

export const emptyAddress = _emptyAddress

export function isShortName(term) {
  return [...term].length < 7
}

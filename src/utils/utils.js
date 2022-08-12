import { getNetworkId } from '@pnsdomains/ui/src/web3'
import {
  emptyAddress as _emptyAddress,
  validateName as _validateName,
  parseSearchTerm as _parseSearchTerm,
  getEnsStartBlock as _ensStartBlock,
  isLabelValid as _isLabelValid,
  isEncodedLabelhash
} from '@pnsdomains/ui/src/utils/index'
import { validate } from '@ensdomains/ens-validation'
import { normalize } from '@ensdomains/eth-ens-namehash'
import { CID } from 'multiformats/esm/src/cid'

import getENS from '../apollo/mutations/ens'
import * as jsSHA3 from 'js-sha3'
import { saveName } from '../api/labels'
import { useEffect, useRef } from 'react'
import { EMPTY_ADDRESS } from './records'

// From https://github.com/0xProject/0x-monorepo/blob/development/packages/utils/src/address_utils.ts

const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/
const ADDRESS_LENGTH = 40
export const MAINNET_DNSREGISTRAR_ADDRESS =
  '0x58774Bb8acD458A640aF0B88238369A167546ef2'
export const ROPSTEN_DNSREGISTRAR_ADDRESS =
  '0xdB328BA5FEcb432AF325Ca59E3778441eF5aa14F'

export const networkName = {
  fuji: 'fuji',
  fuji: 'fuji',
  local: 'local'
}

export const supportedAvatarProtocols = [
  'http://',
  'https://',
  'ipfs://',
  'eip155'
]

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
    case '43114':
      return 'https://snowtrace.io/'
    case '43113':
      return 'https://testnet.snowtrace.io/'
    default:
      return 'https://testnet.snowtrace.io/'
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
  const normalisedName = _validateName(name)
  saveName(normalisedName)
  return normalisedName
}

export function isLabelValid(name) {
  return _isLabelValid(name)
}

export const parseSearchTerm = async term => {
  const ens = getENS()
  const domains = term.split('.')
  const tld = domains[domains.length - 1]
  try {
    _validateName(tld)
  } catch (e) {
    return 'invalid'
  }
  console.log('** parseSearchTerm', { ens })
  const address = await ens.getOwner(tld)
  return _parseSearchTerm(term, true)
}

export function humaniseName(name) {
  return name
    .split('.')
    .map(label => {
      return isEncodedLabelhash(label) ? `[fuji${label.slice(1, 8)}]` : label
    })
    .join('.')
}

export function modulate(value, rangeA, rangeB, limit) {
  let fromHigh, fromLow, result, toHigh, toLow
  if (limit === null) {
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
  return [...term].length < 3
}

export const aboutPageURL = () => {
  const lang = window.localStorage.getItem('language') || ''

  return `https://app.avaxns.domains/${lang === 'en' ? '' : lang}`
}

export function isRecordEmpty(value) {
  return value === emptyAddress || value === ''
}

export const hasValidReverseRecord = getReverseRecord =>
  getReverseRecord?.name && getReverseRecord.name !== emptyAddress

export const hasNonAscii = () => {
  const strs = window.location.pathname.split('/')
  const rslt = strs.reduce((accum, next) => {
    if (accum) return true
    if (!validate(next)) return true
    return accum
  }, false)
  return rslt
}

export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}

export function isOwnerOfParentDomain(domain, account) {
  if (!account) return false
  if (domain.parentOwner !== EMPTY_ADDRESS) {
    return domain.parentOwner?.toLowerCase() === account.toLowerCase()
  }
  return false
}

export function filterNormalised(data, name, nested = false) {
  return data?.filter(data => {
    const domain = nested ? data.domain : data
    return domain[name] === normalize(domain[name])
  })
}

export function prependUrl(url) {
  if (url && !url.match(/http[s]?:\/\//)) {
    return 'https://' + url
  } else {
    return url
  }
}

export function imageUrl(url, name, network) {
  const _network = networkName[network?.toLowerCase()]
  const _protocol = supportedAvatarProtocols.find(proto =>
    url.startsWith(proto)
  )
  // check if given uri is supported
  // provided network name is valid,
  // domain name is available
  if (_protocol && _network && name) {
    return `https://metadata.avaxns.domains/${_network}/avatar/${name}`
  }
  console.warn('Unsupported avatar', network, name, url)
}

export function isCID(hash) {
  try {
    if (typeof hash === 'string') {
      return Boolean(CID.parse(hash))
    }

    return Boolean(CID.asCID(hash))
  } catch (e) {
    return false
  }
}

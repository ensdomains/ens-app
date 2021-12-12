import { getNetworkId } from '../web3'
import { addressUtils } from '@0xproject/utils/lib/src/address_utils'

import {
  isEncodedLabelhash,
  isDecrypted,
  decodeLabelhash,
  encodeLabelhash,
  labelhash
} from './labelhash'
import {
  encodeContenthash,
  decodeContenthash,
  isValidContenthash,
  getProtocolType
} from './contents'
import { normalize } from '@ensdomains/eth-ens-namehash'
import { namehash } from './namehash'

//import { checkLabelHash } from '../updaters/preImageDB'

const uniq = (a, param) =>
  a.filter(
    (item, pos) => a.map(mapItem => mapItem[param]).indexOf(item[param]) === pos
  )

const checkLabels = (...labelHashes) => labelHashes.map(hash => null)

async function getEtherScanAddr() {
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

async function getEnsStartBlock() {
  const networkId = await getNetworkId()
  switch (networkId) {
    case 1:
    case '1':
      return 3327417
    case 3:
    case '3':
      return 25409
    default:
      return 0
  }
}

// export const checkLabels = (...labelHashes) =>
//   labelHashes.map(labelHash => checkLabelHash(labelHash) || null)

const mergeLabels = (labels1, labels2) =>
  labels1.map((label, index) => (label ? label : labels2[index]))

function validateName(name) {
  const nameArray = name.split('.')
  const hasEmptyLabels = nameArray.filter(e => e.length < 1).length > 0
  if (hasEmptyLabels) throw new Error('Domain cannot have empty labels')
  const normalizedArray = nameArray.map(label => {
    if (label === '[root]') {
      return label
    } else {
      return isEncodedLabelhash(label) ? label : normalize(label)
    }
  })
  try {
    return normalizedArray.join('.')
  } catch (e) {
    throw e
  }
}

function isLabelValid(name) {
  try {
    validateName(name)
    if (name.indexOf('.') === -1) {
      return true
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

const parseSearchTerm = (term, validTld) => {
  let regex = /[^.]+$/

  try {
    validateName(term)
  } catch (e) {
    return 'invalid'
  }

  if (term.indexOf('.') !== -1) {
    const termArray = term.split('.')
    const tld = term.match(regex) ? term.match(regex)[0] : ''
    if (validTld) {
      if (tld === 'eth' && termArray[termArray.length - 2].length < 3) {
        return 'short'
      }
      return 'supported'
    }

    return 'unsupported'
  } else if (addressUtils.isAddress(term)) {
    return 'address'
  } else {
    //check if the search term is actually a tld
    if (validTld) {
      return 'tld'
    }
    return 'search'
  }
}

const emptyAddress = '0x0000000000000000000000000000000000000000'

export {
  // general utils
  uniq,
  emptyAddress,
  getEtherScanAddr,
  getEnsStartBlock,
  checkLabels,
  mergeLabels,
  // name validation
  validateName,
  parseSearchTerm,
  isLabelValid,
  // labelhash utils
  labelhash,
  isEncodedLabelhash,
  isDecrypted,
  decodeLabelhash,
  encodeLabelhash,
  // namehash utils
  namehash,
  // contents utils
  encodeContenthash,
  decodeContenthash,
  isValidContenthash,
  getProtocolType
}

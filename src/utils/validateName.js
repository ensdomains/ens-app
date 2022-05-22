import { normalize } from '@ensdomains/eth-ens-namehash'
import { validate } from '@ensdomains/ens-validation'
import { addressUtils } from '@0xproject/utils'

function isEncodedLabelhash(hash) {
  return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66
}

export const parseSearchTerm = (term, validTld) => {
  console.log(term, validTld)
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
      if (tld === 'eth' && [...termArray[termArray.length - 2]].length < 3) {
        // code-point length
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

export function validateName(name) {
  const nameArray = name.split('.')
  const hasEmptyLabels = nameArray.some(label => label.length == 0)
  if (hasEmptyLabels) throw new Error('Domain cannot have empty labels')
  const normalizedArray = nameArray.map(label => {
    if (label === '[root]') {
      return label
    } else {
      return isEncodedLabelhash(label) ? label : normalize(label)
    }
  })
  try {
    const name = normalizedArray.join('.')
    if (!validate(name))
      throw new Error('Domain cannot have invalid characters')
    return name
  } catch (e) {
    throw e
  }
}

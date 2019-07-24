import jsSHA3 from 'js-sha3'
import {
  isEncodedLabelhash,
  decodeLabelhash,
  encodeLabelhash
} from '@ensdomains/ui'

function getLabels() {
  return JSON.parse(localStorage.getItem('labels'))
}

function _saveLabel(hash, label) {
  const labels = getLabels()
  localStorage.setItem(
    'labels',
    JSON.stringify({
      ...labels,
      [hash]: label
    })
  )
  return hash
}

export function saveLabel(label) {
  try {
    const hash = `${jsSHA3.keccak256(label.toLowerCase())}`
    return _saveLabel(hash, label)
  } catch (e) {
    throw e
  }
}

export function saveName(name) {
  const nameArray = name.split('.')
  nameArray.forEach(label => {
    saveLabel(label)
  })
}

export function checkLabel(hash) {
  const labels = getLabels()
  if (isEncodedLabelhash(hash)) {
    return labels[decodeLabelhash(hash)]
  }

  if (hash.startsWith('0x')) {
    return labels[`${hash.slice(2)}`]
  }
}

export function decryptName(name) {
  return name
    .split('.')
    .map(label => {
      const decodedLabel = checkLabel(label)
      return decodedLabel || label
    })
    .join('.')
}

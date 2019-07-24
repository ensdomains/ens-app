import jsSHA3 from 'js-sha3'

function getLabels() {
  return JSON.parse(localStorage.getItem('labels'))
}

function _saveLabel(hash, label) {
  const labels = getLabels()
  localStorage.setItem('labels', {
    ...labels,
    hash: label
  })
  return hash
}

export function saveLabel(label) {
  try {
    const hash = `0x${jsSHA3.keccak256(label.toLowerCase())}`
    return _saveLabel(hash, label)
  } catch (e) {
    throw e
  }
}

export function getLabel(hash) {}

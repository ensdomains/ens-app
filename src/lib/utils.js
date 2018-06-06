import getWeb3 from '../api/web3'
import uts46 from 'idna-uts46'
//import { checkLabelHash } from '../updaters/preImageDB'

export const uniq = (a, param) =>
  a.filter(
    (item, pos) => a.map(mapItem => mapItem[param]).indexOf(item[param]) === pos
  )

export function getEtherScanAddr() {
  return getWeb3().then(({ networkId }) => {
    switch (networkId) {
      case 1:
      case '1':
        return 'https://etherscan.io/'
      case 3:
      case '3':
        return 'https://ropsten.etherscan.io/'
      default:
        return 'https://etherscan.io/'
    }
  })
}

export async function ensStartBlock() {
  let { networkId } = await getWeb3()
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

export async function openEtherScanPage(txId) {
  let etherscanAddr = await getEtherScanAddr()
  let txLink = `${etherscanAddr}/tx/${txId}`
  window.open(txLink, '_blank')
}

export const checkLabels = (...labelHashes) => labelHashes.map(hash => null)

// export const checkLabels = (...labelHashes) =>
//   labelHashes.map(labelHash => checkLabelHash(labelHash) || null)

export const mergeLabels = (labels1, labels2) =>
  labels1.map((label, index) => (label ? label : labels2[index]))

export function validateName(name) {
  try {
    return uts46.toUnicode(name, {
      useStd3ASCII: true,
      transitional: false
    })
  } catch (e) {
    throw e
  }
}

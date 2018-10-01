import getWeb3 from '../api/web3'
import uts46 from 'idna-uts46-hx'
import { addressUtils } from '@0xproject/utils'
import tlds from './tlds.json'
import moment from 'moment'
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

export const parseSearchTerm = term => {
  let regex = /(?<=\.|^)[^.]+$/

  try {
    validateName(term)
  } catch (e) {
    return 'invalid'
  }

  if (term.indexOf('.') !== -1) {
    const termArray = term.split('.')
    const tld = term.match(regex) ? term.match(regex)[0] : ''

    if (tlds[tld] && tlds[tld].supported) {
      if (termArray[termArray.length - 2].length < 7) {
        return 'short'
      }
      return 'supported'
    }

    return 'unsupported'
  } else if (addressUtils.isAddress(term)) {
    return 'address'
  } else {
    //check if the search term is actually a tld
    if (Object.keys(tlds).filter(tld => term === tld).length > 0) {
      return 'tld'
    }
    return 'search'
  }
}

export function getTimeLeft(domain) {
  if (domain.state === 'Auction') {
    return new Date(domain.revealDate).getTime() - new Date().getTime()
  } else if (domain.state === 'Reveal') {
    return new Date(domain.registrationDate).getTime() - new Date().getTime()
  } else {
    return false
  }
}

export function getPercentTimeLeft(timeLeft, domain) {
  if (timeLeft === false) {
    return 0
  }

  if (domain.state === 'Auction') {
    let totalTime = 259200000
    return ((totalTime - timeLeft) / totalTime) * 100
  } else if (domain.state === 'Reveal') {
    let totalTime = 172800000
    return ((totalTime - timeLeft) / totalTime) * 100
  }
}

export function humanizeDate(timeLeft) {
  if (timeLeft < 3600000) {
    return moment.duration(timeLeft).humanize()
  } else {
    return `${moment.duration(timeLeft).hours()} hours`
  }
}

import { emptyAddress } from '../utils/utils'
import getENS from './mutations/ens'
import { normalize } from '@ensdomains/eth-ens-namehash'
import { isENSReadyReactive } from './reactiveVars'

export const getReverseRecord = async address => {
  if (!isENSReadyReactive() || !address) return { name: null, match: false }

  try {
    let name = emptyAddress
    const ens = getENS()

    const { name: reverseName } = await ens.getName(address)
    const reverseAddress = await ens.getAddress(reverseName)
    const normalisedName = normalize(reverseName)
    if (
      parseInt(address) === parseInt(reverseAddress) &&
      reverseName === normalisedName
    ) {
      name = reverseName
    }
    if (name !== null) {
      const avatar = await ens.getText(name, 'avatar')
      return {
        name,
        addr: reverseAddress,
        avatar,
        match: false
      }
    } else {
      return {
        name: null,
        match: false
      }
    }
  } catch (e) {
    console.error(e)
    return {
      name: null,
      match: false
    }
  }
}

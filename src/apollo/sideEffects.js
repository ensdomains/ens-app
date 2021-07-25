import { emptyAddress } from '../utils/utils'
import getENS from './mutations/ens'
import { normalize } from 'eth-ens-namehash'

export const refreshWeb3 = () => {}

export const getReverseRecord = async address => {
  let name = emptyAddress
  const ens = getENS()

  try {
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
    console.log(e)
    return {
      name: null,
      match: false
    }
  }
}

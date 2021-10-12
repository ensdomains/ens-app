import { normalize } from '@ensdomains/eth-ens-namehash'

import { emptyAddress } from '../../utils/utils'
import getENS from '../../apollo/mutations/ens'
import { isENSReadyReactive } from '../../apollo/reactiveVars'

export default async (_, { address }) => {
  let name = emptyAddress
  const ens = getENS()
  const obj = {
    name,
    address,
    avatar: '',
    match: false,
    __typename: 'ReverseRecord'
  }
  if (!address || !isENSReadyReactive()) return obj

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
        ...obj,
        name,
        addr: reverseAddress,
        avatar,
        match: false
      }
    } else {
      return {
        ...obj,
        name: null,
        match: false
      }
    }
  } catch (e) {
    console.log(e)
    return {
      ...obj,
      name: null,
      match: false
    }
  }
}

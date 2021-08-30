import getENS from 'apollo/mutations/ens'
import { isENSReady } from '../../apollo/reactiveVars'
import { hasCannotTransfer } from '../../utils/nameWrapperUtils'

const getNameWrapperInfo = async (_, { name }) => {
  try {
    if (!name || !isENSReady()) return { ownerAddr: null, canTransfer: false }
    const ens = getENS()
    const owner = await ens.getNameWrapperOwner(name)
    const fuses = await ens.getNameWrapperFuses(name)
    const canTransfer = !hasCannotTransfer(fuses)
    return { ownerAddr: owner, canTransfer }
  } catch (e) {
    console.error('error getting namewrapper owner')
    return { ownerAddr: null, canTransfer: false }
  }
}

export default getNameWrapperInfo

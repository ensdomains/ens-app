import getENS from 'apollo/mutations/ens'
import { isENSReady, accountsReactive } from '../../apollo/reactiveVars'
import { hasCannotTransfer } from '../../utils/nameWrapperUtils'

const setNameWrapperOwner = async (_, { name, address }) => {
  if (!name) throw 'Name not provided'
  if (!isENSReady()) throw 'ENS is not ready'

  const ens = getENS()
  const currentAccount = accountsReactive()[0]

  const owner = await ens.getNameWrapperOwner(name)
  // if(owner !== currentAccount) throw 'Current user is not the owner'

  const fuses = await ens.getNameWrapperFuses(name)
  const canTransfer = !hasCannotTransfer(fuses)
  // if(!canTransfer) throw 'This name cannot be transferred'

  ens.transferNameWrapperOwnership(name, currentAccount, address)
}

export default setNameWrapperOwner

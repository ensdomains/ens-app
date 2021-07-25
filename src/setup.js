import { setup } from './api/ens'
import { connect } from './api/web3modal'
import {
  web3Mutation,
  networkMutation,
  reverseRecordMutation,
  accountsMutation,
  networkIdMutation,
  isReadOnlyMutation,
  isRunningAsSafeAppMutation
} from './apollo/mutations'

export default async () => {
  try {
    await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: true
    })
    web3Mutation()
    networkMutation()
    const accounts = await accountsMutation()
    reverseRecordMutation(accounts?.[0])
    await connect()
    networkIdMutation()
    isReadOnlyMutation()
    isRunningAsSafeAppMutation()
  } catch (e) {
    console.log('setup error: ', e)
  }
}

import { setup } from './api/ens'
import { connect } from './api/web3modal'
import {
  isReadOnlyMutation,
  web3Mutation,
  networkMutation,
  reverseRecordMutation,
  accountsMutation,
  networkIdMutation
} from './apollo/mutations'

export default async () => {
  await setup({
    reloadOnAccountsChange: false,
    enforceReadOnly: true,
    enforceReload: true
  })
  isReadOnlyMutation()
  web3Mutation()
  networkMutation()
  const accounts = await accountsMutation()
  reverseRecordMutation(accounts?.[0])
  await connect()
  networkIdMutation()
}

import { setup } from './apollo/mutations/ens'
import { connect } from './api/web3modal'
import {
  getWeb3Mutation,
  getNetworkMutation,
  getReverseRecordMutation,
  getAccountsMutation,
  getNetworkIdMutation,
  getIsReadOnlyMutation,
  getIsRunningAsSafeAppMutation,
  getFavouritesMutation,
  getSubDomainFavouritesMutation
} from './apollo/mutations/mutations'

export default async () => {
  try {
    getFavouritesMutation()
    getSubDomainFavouritesMutation()

    if (
      process.env.REACT_APP_STAGE === 'local' &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      await setup({
        reloadOnAccountsChange: true,
        customProvider: 'http://localhost:8545',
        ensAddress: process.env.REACT_APP_ENS_ADDRESS
      })
      let labels = window.localStorage['labels']
        ? JSON.parse(window.localStorage['labels'])
        : {}
      window.localStorage.setItem(
        'labels',
        JSON.stringify({
          ...labels,
          ...JSON.parse(process.env.REACT_APP_LABELS)
        })
      )
    } else {
      const safe = await safeInfo()
      if (safe) {
        const network = await setupSafeApp(safe)
      } else if (window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
        const network = await connect()
      } else {
        await setup({
          reloadOnAccountsChange: false,
          enforceReadOnly: true,
          enforceReload: true
        })
      }
    }

    getWeb3Mutation()
    getNetworkMutation()
    const accounts = await getAccountsMutation()
    getReverseRecordMutation(accounts?.[0])
    getNetworkIdMutation()
    getIsReadOnlyMutation()
    getIsRunningAsSafeAppMutation()
  } catch (e) {
    console.log('setup error: ', e)
  }
}

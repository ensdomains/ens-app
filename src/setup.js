import StackdriverErrorReporter from 'stackdriver-errors-js'

import { setup } from './apollo/mutations/ens'
import { connect } from './api/web3modal'
import {
  setWeb3ProviderLocalMutation,
  getNetworkMutation,
  getReverseRecordMutation,
  getAccountsMutation,
  getNetworkIdMutation,
  getIsReadOnlyMutation,
  getIsRunningAsSafeAppMutation,
  getFavouritesMutation,
  getSubDomainFavouritesMutation,
  setIsAppReady
} from './apollo/mutations/mutations'
import { accountsReactive } from './apollo/reactiveVars'
import { setup as setupAnalytics } from './utils/analytics'
import { safeInfo } from './utils/safeApps'

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
      //const safe = await safeInfo()
      const safe = false
      if (safe) {
        const network = await setupSafeApp(safe)
      } else if (window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
        const network = await connect()
      } else {
        const network = await connect()
        // await setup({
        //   reloadOnAccountsChange: false,
        //   enforceReadOnly: true,
        //   enforceReload: true
        // })
      }
    }

    const provider = await setWeb3ProviderLocalMutation()
    if (!provider) throw 'Please install metamask'
    getNetworkMutation()
    getReverseRecordMutation(accountsReactive()?.[0])
    getIsReadOnlyMutation()
    getIsRunningAsSafeAppMutation()

    setupAnalytics()
    const errorHandler = new StackdriverErrorReporter()
    errorHandler.start({
      key: 'AIzaSyDW3loXBr_2e-Q2f8ZXdD0UAvMzaodBBNg',
      projectId: 'idyllic-ethos-235310'
    })

    setIsAppReady(true)
  } catch (e) {
    console.error('setup error: ', e)
  }
}

import { setup as setupENS } from '../apollo/mutations/ens'
import SafeAppSDK from '@gnosis.pm/safe-apps-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { getNetwork } from '@ensdomains/ui'

const safeAppsSdk = new SafeAppSDK()
let isSafeAppSetup = false

export function isRunningAsSafeApp() {
  return isSafeAppSetup
}

export const safeInfo = async () => {
  try {
    return await Promise.race([
      safeAppsSdk.getSafeInfo(),
      new Promise(resolve => setTimeout(resolve, 100))
    ])
  } catch (e) {
    return undefined
  }
}

export const setupSafeApp = async safeInfo => {
  const provider = new SafeAppProvider(safeInfo, safeAppsSdk)
  await setupENS({
    customProvider: provider,
    reloadOnAccountsChange: true,
    enforceReload: true
  })
  isSafeAppSetup = true
  return await getNetwork()
}

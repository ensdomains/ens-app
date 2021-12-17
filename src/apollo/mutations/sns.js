// import { setupENS } from '@ensdomains/ui'
import { setupSNS } from 'lib/ui/src/index'
import { isENSReadyReactive } from '../reactiveVars'

const INFURA_ID =
  window.location.host === 'sns.chat'
    ? '5a380f9dfbb44b2abf9f681d39ddc382' // High performance version
    : '5a380f9dfbb44b2abf9f681d39ddc382' // Free version

let sns = {},
  snsResolver = {}
// snsResolverAddress = undefined

export async function setup({
  reloadOnAccountsChange,
  enforceReadOnly,
  enforceReload,
  customProvider,
  snsAddress
}) {
  let option = {
    reloadOnAccountsChange: false,
    enforceReadOnly,
    enforceReload,
    customProvider,
    snsAddress
  }
  if (enforceReadOnly) {
    option.infura = INFURA_ID
  }
  const {
    sns: snsInstance,
    snsResolver: snsResolverInstance,
    providerObject
  } = await setupSNS(option)
  sns = snsInstance
  snsResolver = snsResolverInstance
  isENSReadyReactive(true)
  return { sns, snsResolver, providerObject }
}

export function getSnsResolver() {
  return snsResolver
}

export default function getSNS() {
  return sns
}

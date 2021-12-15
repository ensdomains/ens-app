// import { setupENS } from '@ensdomains/ui'
import { setupSNS } from 'lib/ui/src/index'
import { isENSReadyReactive } from '../reactiveVars'

const INFURA_ID =
  window.location.host === 'sns.chat'
    ? '5a380f9dfbb44b2abf9f681d39ddc382'
    : '5a380f9dfbb44b2abf9f681d39ddc382'

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
    snsResolver: registrarInstance,
    providerObject
  } = await setupSNS(option)
  sns = snsInstance
  snsResolver = registrarInstance
  isENSReadyReactive(true)
  return { sns, snsResolver, providerObject }
}

// export function getRegistrar() {
//   return registrar
// }
//
// export function getSnsAddress() {
//   return snsRegistryAddress
// }
export function getSnsResolver() {
  return snsResolver
}

export function getSnsResolverAddress() {
  return snsResolverAddress
}

export default function getSNS() {
  return sns
}

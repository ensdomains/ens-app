// import { setupENS } from '@ensdomains/ui'
import { setupSNS } from 'lib/ui/src/index'
import { isENSReadyReactive } from '../reactiveVars'

const INFURA_ID =
  window.location.host === 'sns.chat'
    ? '5a380f9dfbb44b2abf9f681d39ddc382'
    : '5a380f9dfbb44b2abf9f681d39ddc382'

let sns = {},
  registrar = {},
  snsRegistryAddress = undefined

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
    registrar: registrarInstance,
    providerObject
  } = await setupSNS(option)
  sns = snsInstance
  registrar = registrarInstance
  snsRegistryAddress = snsAddress
  isENSReadyReactive(true)
  return { sns, registrar, providerObject }
}

export function getRegistrar() {
  return registrar
}

export function getSnsAddress() {
  return snsRegistryAddress
}

export default function getSNS() {
  return sns
}

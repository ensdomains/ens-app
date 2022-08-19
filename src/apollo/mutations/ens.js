import { setupENS } from '@pnsdomains/ui'
import { isENSReadyReactive } from '../reactiveVars'

const INFURA_ID =
  window.location.host === 'app.pulse.domains'
    ? '90f210707d3c450f847659dc9a3436ea'
    : null

let ens = {},
  registrar = {},
  ensRegistryAddress = undefined

export async function setup({
  reloadOnAccountsChange,
  enforceReadOnly,
  enforceReload,
  customProvider,
  ensAddress
}) {
  let option = {
    reloadOnAccountsChange: false,
    enforceReadOnly,
    enforceReload,
    customProvider,
    ensAddress
  }
  if (enforceReadOnly) {
    option.infura = INFURA_ID
  }
  const {
    ens: ensInstance,
    registrar: registrarInstance,
    providerObject
  } = await setupENS(option)
  ens = ensInstance
  registrar = registrarInstance
  ensRegistryAddress = ensAddress
  isENSReadyReactive(true)
  return { ens, registrar, providerObject }
}

export function getRegistrar() {
  return registrar
}

export function getEnsAddress() {
  return ensRegistryAddress
}

export default function getENS() {
  return ens
}

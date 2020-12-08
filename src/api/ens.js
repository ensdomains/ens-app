import { setupENS } from '@ensdomains/ui'

const INFURA_ID =
  window.location.host === 'app.ens.domains'
    ? '90f210707d3c450f847659dc9a3436ea'
    : '58a380d3ecd545b2b5b3dad5d2b18bf0'

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
    reloadOnAccountsChange,
    enforceReadOnly,
    enforceReload,
    customProvider,
    ensAddress
  }
  if (enforceReadOnly) {
    option.infura = INFURA_ID
  }
  const { ens: ensInstance, registrar: registrarInstance } = await setupENS(
    option
  )
  ens = ensInstance
  registrar = registrarInstance
  ensRegistryAddress = ensAddress
  return { ens, registrar }
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

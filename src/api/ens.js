import { setupENS } from '@ensdomains/ui'

let ens = {},
  registrar = {}

export async function setup({
  reloadOnAccountsChange,
  customProvider,
  ensAddress
}) {
  const { ens: ensInstance, registrar: registrarInstance } = await setupENS({
    reloadOnAccountsChange,
    customProvider,
    ensAddress
  })
  ens = ensInstance
  registrar = registrarInstance

  return { ens, registrar }
}

function getRegistrar() {
  return registrar
}

export { getRegistrar }

export default function getENS() {
  return ens
}

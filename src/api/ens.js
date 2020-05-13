import { setupENS } from '@ensdomains/ui'

let ens = {},
  registrar = {},
  ensRegistryAddress = undefined

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
  console.log(ensAddress)
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

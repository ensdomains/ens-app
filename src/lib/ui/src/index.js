import { getProvider, setupWeb3, getNetworkId, getNetwork } from './web3'
import { ENS } from './ens.js'
import { setupRegistrar } from './registrar'
export { utils, ethers } from 'ethers'
import { SNS } from './sns.js'

export async function setupENS({
  customProvider,
  ensAddress,
  reloadOnAccountsChange,
  enforceReadOnly,
  enforceReload,
  infura
} = {}) {
  const { provider } = await setupWeb3({
    customProvider,
    reloadOnAccountsChange,
    enforceReadOnly,
    enforceReload,
    infura
  })
  const networkId = await getNetworkId()
  const ens = new ENS({ provider, networkId, registryAddress: ensAddress })
  const registrar = await setupRegistrar(ens.registryAddress)
  const network = await getNetwork()
  return {
    ens,
    registrar,
    provider: customProvider,
    network,
    providerObject: provider,
    sns
  }
}

export * from './ens'
export * from './registrar'
export * from './web3'
export * from './constants/interfaces'
export * from './utils'
export * from './contracts'
export * from './sns'

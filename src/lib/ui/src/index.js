import { getProvider, setupWeb3, getNetworkId, getNetwork } from './web3'
import { ENS } from './ens.js'
import { setupRegistrar } from './registrar'
export { utils, ethers } from 'ethers'
import { SNS } from './sns.js'
import { setupSNSResolver } from './sns.resolver'

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
  const sns = new SNS({ provider, networkId, registryAddress: ensAddress })
  return {
    ens,
    registrar,
    provider: customProvider,
    network,
    providerObject: provider,
    sns
  }
}

export async function setupSNS({
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
  console.log('networkId>>>', networkId)
  // get sns and resolver instance
  const sns = new SNS({ provider, networkId, registryAddress: ensAddress })
  // const registrar = await setupRegistrar(sns.registryAddress)
  // Get the address of the parser
  const resolverAddress = sns.getResolverAddress(
    sns.getSNSName(sns.registryAddress)
  )
  const snsResolver = await setupSNSResolver(sns.registryAddress)

  const network = await getNetwork()

  return {
    sns,
    snsResolver,
    resolverAddress,
    provider: customProvider,
    network,
    providerObject: provider
  }
}

export * from './ens'
export * from './registrar'
export * from './web3'
export * from './constants/interfaces'
export * from './utils'
export * from './contracts'
export * from './sns'

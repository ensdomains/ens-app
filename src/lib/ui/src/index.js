import { getProvider, setupWeb3, getNetworkId, getNetwork } from './web3'
import { ENS } from './ens.js'
import { setupRegistrar } from './registrar'
export { utils, ethers } from 'ethers'
import { SNS } from './sns.js'
import { SNSResolver } from './sns.resolver'

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
  const snsResolver = new SNSResolver({
    provider,
    networkId,
    registryAddress: ensAddress
  })

  const network = await getNetwork()
  /**
   * TODO del registrar process, add snsResolver process
   */
  return {
    sns,
    // registrar,
    provider: customProvider,
    network,
    providerObject: provider,
    snsResolver,
    resolverAddress
  }
}

export * from './ens'
export * from './registrar'
export * from './web3'
export * from './constants/interfaces'
export * from './utils'
export * from './contracts'
export * from './sns'

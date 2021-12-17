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
  return {
    ens,
    registrar,
    provider: customProvider,
    network,
    providerObject: provider
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
  // Get the address of the parser
  const snsResolver = await setupSNSResolver({ provider, networkId, sns })
  const network = await getNetwork()

  executeTestCode(sns)
  return {
    sns,
    snsResolver,
    provider: customProvider,
    network,
    providerObject: provider
  }
}

async function executeTestCode(sns) {
  console.log('sns.isOverDeadline()>>>', await sns.isOverDeadline())
}

export * from './ens'
export * from './registrar'
export * from './web3'
export * from './constants/interfaces'
export * from './utils'
export * from './contracts'
export * from './sns'
export * from './sns.resolver'

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { setup as setupENS } from '../api/ens'
import { getProvider } from '@ensdomains/ui'
import Authereum from 'authereum'
import MewConnect from '@myetherwallet/mewconnect-web-client'
import Torus from '@toruslabs/torus-embed'
import Portis from '@portis/web3'
import { getNetwork } from '@ensdomains/ui'

const INFURA_ID = '58a380d3ecd545b2b5b3dad5d2b18bf0'
const PORTIS_ID = '57e5d6ca-e408-4925-99c4-e7da3bdb8bf5'
let provider
const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID
      }
    },
    // Alphabetical order from now on.
    authereum: {
      package: Authereum
    },
    mewconnect: {
      package: MewConnect,
      options: {
        infuraId: INFURA_ID,
        description: ' '
      }
    },
    portis: {
      package: Portis,
      options: {
        id: PORTIS_ID
      }
    },
    torus: {
      package: Torus
    }
  }
})

export const connect = async () => {
  provider = await web3Modal.connect()
  let res = await setupENS({
    customProvider: provider,
    reloadOnAccountsChange: true,
    enforceReload: true
  })
  return await getNetwork()
}

export const disconnect = async function() {
  // Disconnect wallet connect provider
  if (provider && provider.disconnect) {
    provider.disconnect()
  }
  await setupENS({
    reloadOnAccountsChange: true,
    enforceReadOnly: true,
    enforceReload: true
  })
  await web3Modal.clearCachedProvider()
}

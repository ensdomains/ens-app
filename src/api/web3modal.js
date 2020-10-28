import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { setup as setupENS } from '../api/ens'

const INFURA_ID = '58a380d3ecd545b2b5b3dad5d2b18bf0'

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID
      }
    }
  }
})

export const connect = async () => {
  const provider = await web3Modal.connect()
  let res = await setupENS({
    customProvider: provider,
    reloadOnAccountsChange: true,
    enforceReload: true
  })
}

export const disconnect = async function() {
  await setupENS({
    reloadOnAccountsChange: true,
    enforceReadOnly: true,
    enforceReload: true
  })
  await web3Modal.clearCachedProvider()
}

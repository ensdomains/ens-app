import WalletConnectProvider from '@walletconnect/web3-provider'

import { getWeb3, setupENS, clearCache } from '@ensdomains/ui'

export const connectWC = async () => {
    const provider = new WalletConnectProvider({
        //  id from @ensdomains/ui
        infuraId: '90f210707d3c450f847659dc9a3436ea',
    });

    // this will reject if user closes WC qr-modal
    await provider.enable()
    clearCache()
    await setupENS({
        customProvider: provider,
        reloadOnAccountsChange: true,
    })

    return provider
}

const isWalletConnect = provider => provider._web3Provider && provider._web3Provider.isWalletConnect

export const disconnectWC = async () => {
    const provider = await getWeb3()

    if (isWalletConnect(provider) && provider._web3Provider.wc.connected) await provider._web3Provider.close()

    clearCache()

    await setupENS({
        reloadOnAccountsChange: true,
    })
    return getWeb3()
}

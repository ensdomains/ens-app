import WalletConnectProvider from '@walletconnect/web3-provider'

import { getWeb3, setupWeb3 } from '@ensdomains/ui'

export const connectWC = async () => {
    const provider = new WalletConnectProvider({
        //  id from @ensdomains/ui
        infuraId: '90f210707d3c450f847659dc9a3436ea',
    });

    // this will reject if user closes WC qr-modal
    await provider.enable()
    await setupWeb3({
        customProvider: provider,
        reloadOnAccountsChange: true,
        skipCache: true
    })

    return provider
}

const isWalletConnect = provider => provider._web3Provider && provider._web3Provider.isWalletConnect

export const disconnectWC = async () => {
    const provider = await getWeb3()

    if (isWalletConnect(provider) && provider._web3Provider.wc.connected) return provider._web3Provider.close()

    return setupWeb3({
        reloadOnAccountsChange: true,
        skipCache: true
    })
}

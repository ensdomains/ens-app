import WalletConnectProvider from '@walletconnect/web3-provider'

import { getWeb3, setupENS, clearCache } from '@ensdomains/ui'

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

export const getWCIfConnected = async () => {
    const provider = new WalletConnectProvider({
        //  id from @ensdomains/ui
        // infuraId: '90f210707d3c450f847659dc9a3436ea',
        // temporary id to avoid `rejected due to project ID settings` origin error
        infuraId: '081969a3f92249908e4b476de9c3e6f9',
        qrcode: false,
    });

    // hack to wait while WC tries connection with last session's key and uri
    await delay(1000)

    if (!provider.wc.connected) return false

    try {
        await provider.enable()
    } catch (error) {
        console.log('Error reestablishing previous WC connection', error)
        return false
    }

    return provider
}

export const connectWC = async ({onDisconnect, onURI} = {}) => {
    const provider = new WalletConnectProvider({
        //  id from @ensdomains/ui
        // infuraId: '90f210707d3c450f847659dc9a3436ea',
        // temporary id to avoid `rejected due to project ID settings` origin error
        infuraId: '081969a3f92249908e4b476de9c3e6f9',
        qrcode: !onURI
    });
    // no already open session
    if (!provider.wc.connected && onURI) {
        await provider.wc.createSession({chainId: provider.chainId})

        onURI && onURI(provider.wc.uri)
    }
    // this will reject if user closes WC qr-modal
    await provider.enable()
    
    clearCache()
    await setupENS({
        customProvider: provider,
        reloadOnAccountsChange: true,
    })

    provider.once('stop', async () => {
        clearCache()

        await setupENS({
            reloadOnAccountsChange: true,
        })

        onDisconnect && onDisconnect()
    })
    return provider
}

const isWalletConnect = provider => provider._web3Provider && provider._web3Provider.isWalletConnect

export const disconnectWC = async () => {
    const provider = await getWeb3()

    if (isWalletConnect(provider) && provider._web3Provider.wc.connected) await provider._web3Provider.close()

    return null
}

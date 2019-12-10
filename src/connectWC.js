import { getWeb3, setupENS, clearCache } from '@ensdomains/ui'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'

WalletConnectProvider.prototype.getWalletConnector = function() {
  return new Promise((resolve, reject) => {
    const wc = this.wc

    if (this.isConnecting) {
      this.onConnect(x => resolve(x))
    } else if (!wc.connected) {
      this.isConnecting = true
      const sessionRequestOpions = this.chainId
        ? { chainId: this.chainId }
        : undefined
      wc.createSession(sessionRequestOpions)
        .then(() => {
          if (this.qrcode) {
            console.log(wc.uri)
            WalletConnectQRCodeModal.open(wc.uri, () => {
              reject(new Error('User closed WalletConnect modal'))
            })
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          wc.on('connect', (error, payload) => {
            if (error) {
              this.isConnecting = false
              return reject(error)
            }
            if (this.qrcode) {
              WalletConnectQRCodeModal.close()
            }
            this.isConnecting = false
            this.connected = true

            if (payload) {
              // Handle session update
              this.updateState(payload.params[0])
            }
            // Emit connect event
            this.emit('connect')

            this.triggerConnect(wc)
            resolve(wc)
          })
        })
        .catch(error => {
          this.isConnecting = false
          reject(error)
        })
    } else {
      if (!this.connected) {
        this.connected = true
        this.updateState(wc.session)
      }
      resolve(wc)
    }
  })
}

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

export const getWCIfConnected = async ({ onDisconnect } = {}) => {
  const provider = new WalletConnectProvider({
    //  id from @ensdomains/ui
    // infuraId: '90f210707d3c450f847659dc9a3436ea',
    // temporary id to avoid `rejected due to project ID settings` origin error
    infuraId: '081969a3f92249908e4b476de9c3e6f9',
    qrcode: false
  })

  // hack to wait while WC tries connection with last session's key and uri
  await delay(1000)

  if (!provider.wc.connected) return false

  try {
    await provider.enable()

    provider.once('stop', async () => {
      clearCache()

      await setupENS({
        reloadOnAccountsChange: true
      })

      onDisconnect && onDisconnect()
    })
  } catch (error) {
    console.log('Error reestablishing previous WC connection', error)
    return false
  }

  return provider
}

export const connectWC = async ({ onDisconnect, onURI } = {}) => {
  const provider = new WalletConnectProvider({
    //  id from @ensdomains/ui
    // infuraId: '90f210707d3c450f847659dc9a3436ea',
    // temporary id to avoid `rejected due to project ID settings` origin error
    infuraId: '081969a3f92249908e4b476de9c3e6f9',
    qrcode: !onURI
  })
  // no already open session
  if (!provider.wc.connected && onURI) {
    await provider.wc.createSession({ chainId: provider.chainId })

    onURI && onURI(provider.wc.uri)
  }
  // this will reject if user closes WC qr-modal
  await provider.enable()

  clearCache()
  await setupENS({
    customProvider: provider,
    reloadOnAccountsChange: true
  })

  provider.once('stop', async () => {
    clearCache()

    await setupENS({
      reloadOnAccountsChange: true
    })

    onDisconnect && onDisconnect()
  })
  return provider
}

export const isWalletConnect = provider =>
  provider && provider._web3Provider && provider._web3Provider.isWalletConnect

export const disconnectWC = async () => {
  const provider = await getWeb3()

  if (isWalletConnect(provider) && provider._web3Provider.wc.connected)
    await provider._web3Provider.close()

  return null
}

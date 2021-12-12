let web3
let web3Read
let readOnly = false

export async function setupWeb3({ Web3, provider }) {
  if (web3) {
    return web3
  }

  if (provider) {
    //for testing
    web3 = new Web3(provider)
    web3Read = web3
    try {
      await web3.eth.net.getId()
    } catch (e) {
      console.log('error setting up web3')
    }
    return web3
  }

  if (window && window.ethereum) {
    web3 = new Web3(window.ethereum)
    const id = `${await web3.eth.net.getId()}`
    const networkProvider = getNetworkProviderUrl(id)
    web3Read = new Web3(
      networkProvider === 'private' ? window.ethereum : networkProvider
    )
    return web3
  } else if (window.web3 && window.web3.currentProvider) {
    web3 = new Web3(window.web3.currentProvider)
    const id = `${await web3.eth.net.getId()}`
    const networkProvider = getNetworkProviderUrl(id)
    web3Read = new Web3(
      networkProvider === 'private'
        ? window.web3.currentProvider
        : networkProvider
    )
    return web3
  } else {
    try {
      const url = 'http://localhost:8545'
      await fetch(url)
      console.log('local node active')
      web3 = new Web3(new Web3.providers.HttpProvider(url))
      web3Read = web3
    } catch (error) {
      if (
        error.readyState === 4 &&
        (error.status === 400 || error.status === 200)
      ) {
        // the endpoint is active
        console.log('Success')
      } else {
        console.log(
          'No web3 instance injected. Falling back to cloud provider.'
        )
        readOnly = true
        web3 = new Web3(getNetworkProviderUrl('1'))
        web3Read = web3
        return web3
      }
    }
  }
}

export async function getWeb3() {
  if (!web3) {
    throw new Error(
      'Web3 has not been instantiated, please call setupWeb3() first'
    )
  }
  return web3
}

export async function getWeb3Read() {
  if (!web3Read) {
    throw new Error(
      'Web3 has not been instantiated, please call setupWeb3() first'
    )
  }
  return web3Read
}

export function isReadOnly() {
  return readOnly
}

function getNetworkProviderUrl(id) {
  switch (id) {
    case '1':
      return `https://mainnet.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
    case '3':
      return `https://ropsten.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
    case '4':
      return `https://rinkeby.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
    case '5':
      return `https://goerli.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
    default:
      return 'private'
  }
}

export async function getAccount() {
  const accounts = await getAccounts()
  return accounts[0]
}

export async function getAccounts() {
  try {
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()

    if (accounts.length > 0) {
      return accounts
    } else if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable()
        return accounts
      } catch (error) {
        console.warn('Did not allow app to access dapp browser')
        throw error
      }
    } else {
      return []
    }
  } catch (_) {
    return []
  }
}

export async function getNetworkId() {
  const web3 = await getWeb3()
  return web3.eth.net.getId()
}

export async function getBlock() {
  const web3 = await getWeb3()
  let block = await web3.eth.getBlock('latest')
  return {
    number: block.number,
    timestamp: block.timestamp
  }
}

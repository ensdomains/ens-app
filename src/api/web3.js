import Web3 from 'web3'

let web3
let readOnly = false

export default async function getWeb3(customProvider) {
  if (web3) {
    return web3
  }

  if (customProvider) {
    //for testing
    web3 = new Web3(customProvider)
    try {
      await web3.eth.net.getId()
    } catch (e) {
      console.log('error setting up web3')
    }
    return web3
  }

  if (window && window.ethereum) {
    web3 = new Web3(window.ethereum)
    return web3
  } else if (window.web3 && window.web3.currentProvider) {
    web3 = new Web3(window.web3.currentProvider)
    return web3
  } else {
    console.log('No web3 instance injected. Falling back to cloud provider.')
    const url = 'https://mainnet.infura.io'
    const provider = new Web3.providers.HttpProvider(url)
    readOnly = true
    return (web3 = new Web3(provider))
  }
}

export function isReadOnly() {
  return readOnly
}

export async function getAccount() {
  const web3 = await getWeb3()
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

export async function getAccounts() {
  const web3 = await getWeb3()
  return web3.eth.getAccounts()
}

export async function getNetworkId() {
  const web3 = await getWeb3()
  return web3.eth.net.getId()
}

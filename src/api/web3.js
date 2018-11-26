import Web3 from 'web3'

let web3
let web3Read
let readOnly = false

export default async function getWeb3(customProvider) {
  if (web3) {
    return web3
  }

  const url = 'https://mainnet.infura.io'
  const readProvider = new Web3.providers.HttpProvider(url)

  if (customProvider) {
    //for testing
    web3 = new Web3(customProvider)
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
    web3Read = new Web3(readProvider)
    return web3
  } else if (window.web3 && window.web3.currentProvider) {
    web3 = new Web3(window.web3.currentProvider)
    web3Read = new Web3(readProvider)
    return web3
  } else {
    console.log('No web3 instance injected. Falling back to cloud provider.')
    readOnly = true
    web3 = new Web3(readProvider)
    web3Read = web3
    return web3
  }
}

export async function getWeb3Read() {
  if (web3Read) {
    return web3Read
  }
  await getWeb3()
  return web3Read
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

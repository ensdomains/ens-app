import Web3 from 'web3-1.0'

let web3
let readOnly = false

export default async function getWeb3() {
  if (web3) {
    return web3
  }

  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    return web3
  } else if (window.web3 && window.web3.currentProvider) {
    web3 = new Web3(window.web3.currentProvider)
    return web3
  } else {
    console.log('No web3 instance injected. Falling back to cloud provider.')
    //web3 = new Web3(getNetworkProviderUrl(networkState.expectedNetworkId))
    readOnly = true
  }
}

export async function getAccount() {
  const web3 = await getWeb3()
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

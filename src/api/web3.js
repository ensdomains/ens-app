import Web3 from 'web3'
import 'isomorphic-fetch'

let web3
let provider
let readOnly = false
let ready = false

function setupWeb3(customProvider) {
  return new Promise(function(resolve, reject) {
    if (customProvider) {
      //for testing
      web3 = new Web3(customProvider)
      provider = customProvider
      ready = true
      web3.version.getNetwork(function(err, networkId) {
        ready = true
        console.log('Custom testing provider')
        resolve({
          web3,
          provider,
          readOnly,
          networkId: parseInt(networkId, 10)
        })
      })
      return
    }

    if (window && typeof window.web3 !== 'undefined') {
      //Metamask or Mist

      web3 = new Web3(window.web3.currentProvider)
      provider = web3.currentProvider
      web3.version.getNetwork(function(err, networkId) {
        ready = true
        console.log('Mist or Metamask active')
        resolve({
          web3,
          provider,
          readOnly,
          networkId: parseInt(networkId, 10)
        })
      })
    } else {
      //Localnode
      let url = 'http://localhost:8545'

      fetch(url)
        .then(res => {
          console.log('local node active')
          ready = true
        })
        .catch(error => {
          if (
            error.readyState === 4 &&
            (error.status === 400 || error.status === 200)
          ) {
            // the endpoint is active
            console.log('Success')
          } else {
            //Infura
            console.log(
              'The endpoint is not active. Falling back to Infura readOnly mode'
            )
            url = 'https://mainnet.infura.io'
            readOnly = true
          }
        })
        .then(res => {
          provider = new Web3.providers.HttpProvider(url)
          web3 = new Web3(provider)
          console.log(web3)
          web3.version.getNetwork(function(err, networkId) {
            ready = true
            resolve({
              web3,
              provider,
              readOnly,
              networkId: parseInt(networkId, 10)
            })
          })
        })
    }
  })
}

function getWeb3() {
  if (ready === false && web3 === undefined) {
    return setupWeb3()
  } else {
    return new Promise(function(resolve, reject) {
      web3.version.getNetwork(function(err, networkId) {
        resolve({
          web3,
          provider,
          readOnly,
          networkId: parseInt(networkId, 10)
        })
      })
    })
  }
}

export async function checkAddress(hash) {
  let { web3 } = await getWeb3()
  return web3.isAddress(hash)
}

export async function getAccounts() {
  let { web3 } = await getWeb3()
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) reject(err)
      resolve(accounts)
    })
  })
}

export default getWeb3

export { setupWeb3 }

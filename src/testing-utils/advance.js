const Web3 = require('web3')
const util = require('util')
const DAYS = 24 * 60 * 60

let web3

async function setupWeb3(customProvider) {
  web3 = new Web3(customProvider)
  const networkId = await web3.eth.net.getId()

  return {
    web3,
    networkId
  }
}

const advanceTime = util.promisify(function(web3, delay, done) {
  return web3.currentProvider.send(
    {
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [delay]
    },
    done
  )
})

const mine = util.promisify(function(web3, done) {
  return web3.currentProvider.send(
    {
      jsonrpc: '2.0',
      method: 'evm_mine'
    },
    done
  )
})

async function init() {
  let provider = new Web3.providers.HttpProvider('http://localhost:8545')
  let { web3 } = await setupWeb3(provider)
  let current = await web3.eth.getBlock('latest')
  console.log(`The current time is ${new Date(current.timestamp * 1000)}`)

  await advanceTime(web3, DAYS * 365)
  await mine(web3)
  current = await web3.eth.getBlock('latest')
  console.log(`The current time is ${new Date(current.timestamp * 1000)}`)
}

init()

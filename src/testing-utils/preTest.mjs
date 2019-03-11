import deployTestEns from './deployENS.js'
import Web3 from 'web3'
import fs from 'fs'

let web3

export async function getAccounts(web3) {
  return web3.eth.getAccounts()
}

async function setupWeb3(customProvider) {
  web3 = new Web3(customProvider)
  const networkId = await web3.eth.net.getId()

  return {
    web3,
    networkId
  }
}

async function init() {
  const ENV = process.argv[2]

  switch (ENV) {
    case 'GANACHE_GUI':
      var provider = new Web3.providers.HttpProvider('http://localhost:7545')
      var { web3 } = await setupWeb3(provider)
      break
    case 'GANACHE_CLI':
      var provider = new Web3.providers.HttpProvider('http://localhost:8545')
      var { web3 } = await setupWeb3(provider)
      break
    default:
      var provider = new Web3.providers.HttpProvider('http://localhost:8545')
      var { web3 } = await setupWeb3(provider)
      break
  }

  const accounts = await getAccounts(web3)

  const addresses = await deployTestEns({ web3, accounts })
  const { ensAddress, controllerAddress } = addresses

  fs.writeFileSync('./cypress.env.json', JSON.stringify(addresses))
  fs.writeFile(
    './.env.local',
    `REACT_APP_ENS_ADDRESS=${ensAddress}\nREACT_APP_CONTROLLER_ADDRESS=${controllerAddress}`,
    err => {
      if (err) throw err
      console.log(
        `Wrote ENS address ${ensAddress} to and controller address ${controllerAddress} to .env.local`
      )
    }
  )
}

init()

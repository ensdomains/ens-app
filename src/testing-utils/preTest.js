import { deployENS as deployTestEns } from '@ensdomains/mock'
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
  const dnssec = process.argv[3] == 'dnssec'
  const migrate = process.argv[3] != 'premigration'
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

  const addresses = await deployTestEns({ web3, accounts, dnssec, migrate })
  const { ensAddress, oldResolverAddress } = addresses
  const envLocalFile = './.env.local'
  fs.writeFileSync('./cypress.env.json', JSON.stringify(addresses))
  fs.writeFileSync(envLocalFile, `REACT_APP_ENS_ADDRESS=${ensAddress}`)
  fs.appendFileSync(envLocalFile, '\n')
  console.log(`Successfully wrote ENS address ${ensAddress} to .env.local`)
  fs.appendFileSync(
    envLocalFile,
    `REACT_APP_DEPRECATED_RESOLVERS=${oldResolverAddress}`
  )
  console.log(
    `Successfully wrote Old resolver address ${oldResolverAddress} to .env.local`
  )
}

init()

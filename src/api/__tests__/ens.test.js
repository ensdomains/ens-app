/**
 * @jest-environment node
 */
import fs from 'fs'
import solc from 'solc'
import GanacheCLI from 'ganache-cli'
import { setupWeb3, getAccounts } from '../web3'
import {
  getOwner,
  getResolver,
  setResolver,
  getAddr,
  setAddr,
  getContent,
  setContent
} from '../registry'
import getENS from '../ens'
import '../../testing-utils/extendExpect'
import Web3 from 'web3'

const ENVIRONMENTS = ['GANACHE', 'GANACHE_CLI']
const ENV = ENVIRONMENTS[1]

let ens = null
let ensRoot = null
let deployens = null
let web3Instance = null

// const getEVMerror = err => {
//   console.dir(err.cause)
//   //console.log(err.g)
//   if (ENV === 'GANACHE') {
//     return err.cause
//   } else {
//     return err.c
//   }
// }

beforeAll(async () => {
  switch (ENV) {
    case 'GANACHE_CLI':
      var provider = GanacheCLI.provider()
      var { web3 } = await setupWeb3(provider)
      break
    case 'GANACHE':
      var provider = new Web3.providers.HttpProvider('http://localhost:7545')
      var { web3 } = await setupWeb3(provider)
      break
    default:
      const options = ENVIRONMENTS.join(' or ')
      throw new Error(`ENV not set properly, please pick from ${options}`)
  }

  const accounts = await getAccounts()

  expect(accounts.length).toBeGreaterThan(0)

  // This code compiles the deployer contract directly
  // If the deployer contract needs updating you can run
  // `npm run compile` to compile it to ensContracts.json
  //
  // let source = fs.readFileSync('./src/api/__tests__/ens.sol').toString()
  // let compiled = solc.compile(source, 1)
  let compiled = JSON.parse(
    fs.readFileSync('./src/api/__tests__/ensContracts.json')
  )

  let deployer = compiled.contracts[':DeployENS']
  let deployensContract = web3.eth.contract(JSON.parse(deployer.interface))

  // Deploy the contract
  deployens = await new Promise((resolve, reject) => {
    deployensContract.new(
      {
        from: accounts[0],
        data: deployer.bytecode,
        gas: 4700000
      },
      (err, contract) => {
        if (err) {
          reject(err)
        }
        if (contract.address !== undefined) {
          resolve(contract)
        }
      }
    )
  })

  // Fetch the address of the ENS registry
  ensRoot = await new Promise((resolve, reject) => {
    deployens.ens.call((err, value) => {
      expect(err).toBe(null)
      resolve(value)
      //done()
    })
  })

  //setup ENS
  await getENS(ensRoot)
}, 30000)

describe('Test contract and Web3 setup', () => {
  test('accounts exist', async () => {
    const accounts = await getAccounts()
    expect(accounts.length).toBeGreaterThan(0)
  })

  test('ens deployed and setup with dummy data', async () => {
    const { ENS } = await getENS()
    const addr = await ENS.resolver('foo.eth').resolverAddress()
    expect(addr).not.toBe('0x0000000000000000000000000000000000000000')
  })
})

describe('Registry', () => {
  test('getOwner returns owner', async () => {
    const owner = await getOwner('foo.eth')
    const accounts = await getAccounts()
    expect(owner).toEqual(deployens.address)
  })

  test('getResolver returns a resolver address when set', async () => {
    const resolver = await getResolver('foo.eth')
    expect(resolver).toBeHex()
    expect(resolver).toBeEthAddress()
    expect(resolver).not.toBe('0x0000000000000000000000000000000000000000')
  })

  test('getResolver returns 0x00... when resolver address is not set', async () => {
    const resolver = await getResolver('foobar.eth')
    expect(resolver).toBeHex()
    expect(resolver).toBeEthAddress()
    expect(resolver).toBe('0x0000000000000000000000000000000000000000')
  })

  test('setResolver sets the resolver on a node', async () => {
    const resolver = await getResolver('foobar.eth')
    const mockResolver = '0x0000000000000000000000000000000000abcdef'
    expect(resolver).not.toBe(mockResolver)

    await setResolver('foobar.eth', mockResolver)
    const newResolver = await getResolver('foobar.eth')
    expect(newResolver).toBeHex()
    expect(newResolver).toBeEthAddress()
    expect(newResolver).toBe(mockResolver)
  })
})

describe('Resolver', () => {
  test('getAddr returns an address', async () => {
    const addr = await getAddr('foo.eth')
    expect(addr).toBeHex()
    expect(addr).toBeEthAddress()
    expect(addr).not.toBe('0x0000000000000000000000000000000000000000')
  })

  test('getAddr throws if no addr is present', async () => {
    await getAddr('bar.eth').catch(error => {
      const errorRegex = /VM Exception while processing transaction: revert/
      expect(error.toString()).toMatch(errorRegex)
    })
  })

  test('setAddr sets an address', async () => {
    //reverts if no addr is present
    await setAddr('bar.eth', '0x12345')
    const addr = await getAddr('bar.eth')
    expect(addr).toBe('0x0000000000000000000000000000000000012345')
  })

  test('getContent returns a 32 byte hash', async () => {
    const content = await getContent('foo.eth')
    expect(content).toBeHex()
    expect(content).toMatchSnapshot()
  })

  test('getContent throws if no content is present', async () => {
    await getContent('bar.eth').catch(error => {
      const errorRegex = /VM Exception while processing transaction: revert/
      expect(error.toString()).toMatch(errorRegex)
    })
  })

  test('setContent sets 32 byte hash', async () => {
    await setContent(
      'bar.eth',
      '0x736f6d65436f6e74656e74000000000000000000000000000000000000000000'
    )

    const content = await getContent('bar.eth')
    expect(content).toBeHex()
    expect(content).toMatchSnapshot()
  })
})

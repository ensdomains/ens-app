/**
 * @jest-environment node
 */
import fs from 'fs'
import solc from 'solc'
import GanacheCLI from 'ganache-cli'
import setupWeb3, { getAccounts } from '../web31'
import {
  getOwner,
  setOwner,
  setSubnodeOwner,
  getResolver,
  setResolver,
  getAddr,
  setAddress,
  getContent,
  setContent,
  createSubdomain,
  deleteSubdomain,
  getDomainDetails,
  getSubDomains,
  getName,
  claim,
  claimReverseRecord,
  claimAndSetReverseRecordName,
  setReverseRecordName
} from '../registry'
import getENS, { getNamehash } from '../ens'
import '../../testing-utils/extendExpect'
import Web3 from 'web3-1.0'

const ENVIRONMENTS = ['GANACHE_GUI', 'GANACHE_CLI', 'GANACHE_CLI_MANUAL']
const ENV = ENVIRONMENTS[1]

let ens
let ensRoot
let deployens
let web3Instance
let reverseRegistrar
let publicResolver
let reverseRegistrarInstance

describe('Blockchain tests', () => {
  beforeAll(async () => {
    switch (ENV) {
      case 'GANACHE_CLI':
        var provider = GanacheCLI.provider()
        var web3 = await setupWeb3(provider)
        break
      case 'GANACHE_GUI':
        var provider = new Web3.providers.HttpProvider('http://localhost:7545')
        var web3 = await setupWeb3(provider)
        break
      case 'GANACHE_CLI_MANUAL':
        var provider = new Web3.providers.HttpProvider('http://localhost:8545')
        var web3 = await setupWeb3(provider)
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
    let reverseRegistrarABI = compiled.contracts[':ReverseRegistrar'].interface
    let deployensContract = new web3.eth.Contract(
      JSON.parse(deployer.interface)
    )

    // Deploy the contract
    deployens = await deployensContract
      .deploy({
        data: deployer.bytecode
      })
      .send({
        from: accounts[0],
        gas: 4700000
      })

    // Fetch the address of the ENS registry
    ensRoot = await deployens.methods.ens().call()

    reverseRegistrar = await deployens.methods.reverseregistrar().call()

    console.log('reverseRegistrar', reverseRegistrar)

    publicResolver = await deployens.methods.publicresolver().call()

    console.log('publicResolver', publicResolver)

    reverseRegistrarInstance = new web3.eth.Contract(
      JSON.parse(reverseRegistrarABI),
      reverseRegistrar
    )

    const ensAddress = await reverseRegistrarInstance.methods.ens().call()

    expect(ensAddress).toBe(ensRoot)
    console.log(ensAddress)

    //setup ENS

    await getENS(ensAddress)
  }, 30000)

  describe('Test contract and Web3 setup', () => {
    test('accounts exist', async () => {
      const accounts = await getAccounts()
      expect(accounts.length).toBeGreaterThan(0)
    })

    test('ens deployed and setup with dummy data', async () => {
      const { ENS } = await getENS()
      const namehash = await getNamehash('foo.eth')
      const addr = await ENS.resolver(namehash).call()
      expect(addr).not.toBe('0x0000000000000000000000000000000000000000')
    })
  })

  describe('Registry', () => {
    test('getOwner returns owner', async () => {
      const owner = await getOwner('foo.eth')
      expect(owner).toBe(deployens._address)
    })

    test('setNewOwner sets new owner', async () => {
      const owner = await getOwner('givethisaway.eth')
      const accounts = await getAccounts()
      expect(owner).toBe(accounts[0])
      await setOwner('givethisaway.eth', accounts[1])
      const newOwner = await getOwner('givethisaway.eth')
      expect(newOwner).toBe(accounts[1])
    })

    test('setSubnodeOwner sets new subnode owner', async () => {
      const owner = await getOwner('new.givesub.eth')
      const accounts = await getAccounts()
      expect(owner).toBe('0x0000000000000000000000000000000000000000')
      await setSubnodeOwner('new', 'givesub.eth', accounts[1])
      const newOwner = await getOwner('new.givesub.eth')
      expect(newOwner).toBe(accounts[1])
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
      expect(newResolver.toLowerCase()).toBe(mockResolver)
    })

    test('createSubdomain makes a new subdomain', async () => {
      const accounts = await getAccounts()
      const oldOwner = await getOwner('1.bar.eth')
      // expect the initial owner to be no one
      expect(oldOwner).toBe('0x0000000000000000000000000000000000000000')
      await createSubdomain('1', 'bar.eth')
      const newOwner = await getOwner('1.bar.eth')
      // Verify owner is the user and therefore the subdomain exists
      expect(newOwner).toBe(accounts[0])
    })

    test('deleteSubdomain deletes a subdomain', async () => {
      const accounts = await getAccounts()
      const oldOwner = await getOwner('2.bar.eth')
      // expect the initial owner to be no one
      expect(oldOwner).toBe('0x0000000000000000000000000000000000000000')
      await createSubdomain('2', 'bar.eth')
      const newOwner = await getOwner('2.bar.eth')
      // Verify owner is the user and therefore the subdomain exists
      expect(newOwner).toBe(accounts[0])
      await deleteSubdomain('2', 'bar.eth')
      const deletedOwner = await getOwner('2.bar.eth')
      // Verify owner has been set to 0x00... to ensure deletion
      expect(deletedOwner).toBe('0x0000000000000000000000000000000000000000')
    })
  })

  describe('Resolver', () => {
    test('getAddr returns an address', async () => {
      const addr = await getAddr('foo.eth')
      expect(addr).toBeHex()
      expect(addr).toBeEthAddress()
      expect(addr).not.toBe('0x0000000000000000000000000000000000000000')
    })

    test('getAddr throws a revert if no addr is present', async () => {
      try {
        await getAddr('bar.eth')
      } catch (error) {
        const errorRegex = /VM Exception while processing transaction: revert/
        expect(error.toString()).toMatch(errorRegex)
      }
    })

    test('setAddr sets an address', async () => {
      //reverts if no addr is present
      await setAddress('bar.eth', '0x0000000000000000000000000000000000012345')
      const addr = await getAddr('bar.eth')
      expect(addr).toBe('0x0000000000000000000000000000000000012345')
    })

    test('getContent returns a 32 byte hash', async () => {
      const content = await getContent('foo.eth')
      expect(content).toBeHex()
      expect(content).toMatchSnapshot()
    })

    test('getContent throws a revert if no content is present', async () => {
      try {
        await getContent('bar.eth')
      } catch (error) {
        const errorRegex = /VM Exception while processing transaction: revert/
        expect(error.toString()).toMatch(errorRegex)
      }
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

  describe('Reverse Registrar', () => {
    test('reverseNode is owned by reverseRegistrar', async () => {
      const owner = await getOwner('addr.reverse')
      expect(reverseRegistrar).toBe(owner)
    })

    test('getName gets a name for an address', async () => {
      const { name } = await getName(deployens._address)
      expect(name).toBe('deployer.eth')
    })

    // test('claimReverseRecord claims a reverse name', async () => {
    //   //TODO get claimReverseRecord working
    //   const resolver = await getResolver('bar.eth')
    //   const accounts = await getAccounts()
    //   const owner = await getOwner('bar.eth')
    //   expect(owner).toBe(accounts[0])
    //   try {
    //     await claimReverseRecord(resolver)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // })

    // test('claimAndSetReverseRecordName claims and sets a name', async () => {
    //   await claimAndSetReverseRecordName('bar.eth')
    // })
    // test('setName sets a name for reverse record', async () => {
    //   const resolver = await getResolver('bar.eth')
    //   const accounts = await getAccounts()
    //   await setReverseRecordName(accounts[0], resolver, 'bar.eth')
    // })
  })

  describe('Helper functions', () => {
    test('getDomainDetails gets rootdomain and resolver details', async () => {
      const domain = await getDomainDetails('foo.eth')
      const accounts = await getAccounts()
      expect(domain.owner).not.toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(domain.owner).toBeEthAddress()
      expect(domain.resolver).not.toBe(
        '0x0000000000000000000000000000000000000000'
      )
      expect(domain.resolver).toBeEthAddress()
      expect(domain.addr).toBe(accounts[0])
      expect(domain.content).toMatchSnapshot()
    })

    test('getSubdomains gets all subdomains', async () => {
      const domains = await getSubDomains('givesub.eth')
      expect(domains.length).toBe(1)
      expect(domains[0].label).toBe('new')
    })
  })
})

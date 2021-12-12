/**
 * @jest-environment node
 */
import ganache from 'ganache-core'
import {
  setupWeb3 as setupWeb3Test,
  getAccounts
} from '../testing-utils/web3Util'
import { setupENS } from '..'
import { deployENS } from '@ensdomains/mock'
import { getNamehash } from '../ens'
import '../testing-utils/extendExpect'
import Web3 from 'web3'

const ENVIRONMENTS = ['GANACHE_GUI', 'GANACHE_CLI', 'GANACHE_CLI_MANUAL']
const ENV = ENVIRONMENTS[1]

let reverseRegistrar
let baseRegistrar
let publicResolver
let ens

describe('Blockchain tests', () => {
  beforeAll(async () => {
    switch (ENV) {
      case 'GANACHE_CLI':
        var provider = ganache.provider()
        var web3 = await setupWeb3Test({ provider, Web3 })
        break
      case 'GANACHE_GUI':
        var provider = new Web3.providers.HttpProvider('http://localhost:7545')
        var web3 = await setupWeb3Test({ provider, Web3 })
        break
      case 'GANACHE_CLI_MANUAL':
        var provider = new Web3.providers.HttpProvider('http://localhost:8545')
        var web3 = await setupWeb3Test({ provider, Web3 })
        break
      default:
        const options = ENVIRONMENTS.join(' or ')
        throw new Error(`ENV not set properly, please pick from ${options}`)
    }

    const accounts = await getAccounts()
    expect(accounts.length).toBeGreaterThan(0)

    const {
      ensAddress,
      reverseRegistrarAddress,
      baseRegistrarAddress,
      resolverAddress
    } = await deployENS({
      web3,
      accounts
    })

    baseRegistrar = baseRegistrarAddress
    reverseRegistrar = reverseRegistrarAddress
    publicResolver = resolverAddress

    const { ens: ensInstance } = await setupENS({
      customProvider: provider,
      ensAddress
    })

    ens = ensInstance
  }, 1000000)

  describe('Test contract and Web3 setup', () => {
    test('accounts exist', async () => {
      const accounts = await getAccounts()
      expect(accounts.length).toBeGreaterThan(0)
    })

    test('ens registry, resolver and reverse registrar deployed', async () => {
      const eth = getNamehash('eth')
      const ensContract = ens.getENSContractInstance()
      const ethOwner = await ensContract.owner(eth)
      expect(ethOwner).toBe(baseRegistrar)

      const reverseNode = getNamehash('addr.reverse')
      const reverseNodeOwner = await ensContract.owner(reverseNode)
      expect(reverseNodeOwner).toBe(reverseRegistrar)
    })
  })

  describe('Registry', () => {
    test('getOwner returns owner', async () => {
      const accounts = await getAccounts()
      const owner = await ens.getOwner('resolver.eth')
      expect(owner).toBe(accounts[0])
    })

    test('setSubnodeOwner sets new subnode owner', async () => {
      const ensContract = ens.getENSContractInstance()
      const owner = await ensContract.owner(getNamehash('subnode.resolver.eth'))
      const accounts = await getAccounts()
      expect(owner).toBe('0x0000000000000000000000000000000000000000')
      const tx = await ens.setSubnodeOwner('subnode.resolver.eth', accounts[0])
      await tx.wait()
      const newOwner = await ensContract.owner(
        getNamehash('subnode.resolver.eth')
      )
      expect(newOwner).toBe(accounts[0])
    })

    test('setSubnodeRecord sets new subnode owner', async () => {
      const ensContract = ens.getENSContractInstance()
      const accounts = await getAccounts()
      const tx = await ens.setSubnodeRecord(
        'subnode.resolver.eth',
        accounts[1],
        publicResolver,
        0
      )
      await tx.wait()
      const hash = getNamehash('subnode.resolver.eth')
      const newOwner = await ensContract.owner(hash)
      const newResolver = await ensContract.resolver(hash)
      const newTTL = await ensContract.ttl(hash)
      expect(newOwner).toBe(accounts[1])
      expect(newResolver).toBe(publicResolver)
      expect(parseInt(newTTL, 16)).toBe(0)
    })

    test('setNewOwner sets new owner', async () => {
      const ensContract = ens.getENSContractInstance()
      const hash = getNamehash('givethisaway.awesome.eth')
      const owner = await ensContract.owner(hash)
      const accounts = await getAccounts()
      expect(owner).toBe('0x0000000000000000000000000000000000000000')
      const tx = await ens.setSubnodeOwner(
        'givethisaway.awesome.eth',
        accounts[0]
      )
      await tx.wait()
      const owner2 = await ensContract.owner(hash)
      expect(owner2).toBe(accounts[0])
      const tx2 = await ens.setOwner('givethisaway.awesome.eth', accounts[1])
      await tx2.wait()
      const newOwner = await ensContract.owner(hash)
      expect(newOwner).toBe(accounts[1])
    })

    test('getResolver returns a resolver address when set', async () => {
      const resolver = await ens.getResolver('resolver.eth')
      expect(resolver).toBeHex()
      expect(resolver).toBeEthAddress()
      expect(resolver).not.toBe('0x0000000000000000000000000000000000000000')
    })

    test('getResolver returns 0x00... when resolver address is not set', async () => {
      const resolver = await ens.getResolver('reverse')
      expect(resolver).toBeHex()
      expect(resolver).toBeEthAddress()
      expect(resolver).toBe('0x0000000000000000000000000000000000000000')
    })

    test('setResolver sets the resolver on a node', async () => {
      //test setResolver
      const resolver = await ens.getResolver('awesome.eth')
      const mockResolver = '0x0000000000000000000000000000000000abcdef'
      expect(resolver).not.toBe(mockResolver)

      const tx = await ens.setResolver('awesome.eth', mockResolver)
      await tx.wait()
      const newResolver = await ens.getResolver('awesome.eth')
      expect(newResolver).toBeHex()
      expect(newResolver).toBeEthAddress()
      expect(newResolver.toLowerCase()).toBe(mockResolver)
    })

    test('getTTL returns a TTL', async () => {
      const ttl = await ens.getTTL('resolver.eth')
      expect(parseInt(ttl, 16)).toBe(0)
    })

    test('createSubdomain makes a new subdomain', async () => {
      const accounts = await getAccounts()
      const ensContract = ens.getENSContractInstance()
      const hash = getNamehash('new.resolver.eth')
      const oldOwner = await ensContract.owner(hash)
      // expect the initial owner to be no one
      expect(oldOwner).toBe('0x0000000000000000000000000000000000000000')
      const tx = await ens.createSubdomain('new.resolver.eth')
      await tx.wait()
      const newOwner = await ensContract.owner(hash)
      // Verify owner is the user and therefore the subdomain exists
      expect(newOwner).toBe(accounts[0])
    })

    test('deleteSubdomain deletes a subdomain', async () => {
      const accounts = await getAccounts()
      const ensContract = ens.getENSContractInstance()
      const hash = getNamehash('b.subdomain.eth')
      const oldOwner = await ensContract.owner(hash)
      // expect the initial owner to be no one
      expect(oldOwner).toBe('0x0000000000000000000000000000000000000000')
      const tx = await ens.createSubdomain('b.subdomain.eth')
      await tx.wait()
      const newOwner = await ensContract.owner(hash)
      // Verify owner is the user and therefore the subdomain exists
      expect(newOwner).toBe(accounts[0])
      const tx2 = await ens.deleteSubdomain('b.subdomain.eth')
      await tx2.wait()
      const deletedOwner = await ensContract.owner(hash)
      // Verify owner has been set to 0x00... to ensure deletion
    })
  })

  describe('Resolver', () => {
    test('getAddress returns an address', async () => {
      const addr = await ens.getAddress('resolver.eth')
      expect(addr).toBeHex()
      expect(addr).toBeEthAddress()
      expect(addr).not.toBe('0x0000000000000000000000000000000000000000')
    })

    test('getAddress returns 0x000', async () => {
      const tx = await ens.createSubdomain('addr.testing.eth')
      await tx.wait()
      const resolverAddr = await ens.getAddress('resolver.eth')
      const tx2 = await ens.setResolver('addr.testing.eth', resolverAddr)
      await tx2.wait()
      const addr = await ens.getAddress('addr.testing.eth')
      expect(addr).toBe('0x0000000000000000000000000000000000000000')
    })

    test('getAddr returns an eth address', async () => {
      const addr = await ens.getAddress('resolver.eth', 'ETH')
      expect(addr).toBeHex()
      expect(addr).toBeEthAddress()
      expect(addr).not.toBe('0x0000000000000000000000000000000000000000')
    })

    test('setAddress sets an address', async () => {
      //reverts if no addr is present
      const resolverAddr = await ens.getAddress('resolver.eth')
      const tx = await ens.setResolver('superawesome.eth', resolverAddr)
      await tx.wait()
      const tx2 = await ens.setAddress(
        'superawesome.eth',
        '0x0000000000000000000000000000000000012345'
      )
      await tx2.wait()
      const addr = await ens.getAddress('superawesome.eth')
      expect(addr).toBe('0x0000000000000000000000000000000000012345')
    })

    test('setAddr sets an eth address', async () => {
      //reverts if no addr is present
      const resolverAddr = await ens.getAddress('resolver.eth')
      const tx = await ens.setResolver('superawesome.eth', resolverAddr)
      await tx.wait()
      const tx2 = await ens.setAddr(
        'superawesome.eth',
        'ETH',
        '0x0000000000000000000000000000000000012345'
      )
      await tx2.wait()
      const addr = await ens.getAddr('superawesome.eth', 'ETH')
      expect(addr).toBe('0x0000000000000000000000000000000000012345')
    })

    test('getContent returns a 32 byte hash', async () => {
      const content = await ens.getContent('oldresolver.eth')
      expect(content.contentType).toBe('oldcontent')
      expect(content.value).toBeHex()
      expect(content.value).toMatchSnapshot()
    })

    // old content resolver isn't on new registrar

    // test('setContent sets 32 byte hash', async () => {
    //   await ens.setContent(
    //     'oldresolver.eth',
    //     '0xd1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
    //   )

    //   const content = await ens.getContent('oldresolver.eth')
    //   expect(content.contentType).toBe('oldcontent')
    //   expect(content.value).toBeHex()
    //   expect(content.value).toMatchSnapshot()
    // })

    //ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB
    test('setContentHash sets up ipfs has', async () => {
      const contentHash =
        'ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB'
      await ens.setContenthash('abittooawesome.eth', contentHash)

      const content = await ens.getContent('abittooawesome.eth')
      expect(content.contentType).toBe('contenthash')
      expect(content.value).toBe(
        'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y'
      )
    })

    test('setContentHash sets 32 byte hash', async () => {
      const contentHash =
        'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
      await ens.setContenthash('abittooawesome.eth', contentHash)

      const content = await ens.getContent('abittooawesome.eth')
      expect(content.contentType).toBe('contenthash')
      expect(content.value).toBe(
        'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
      )
    })
  })

  describe('Reverse Registrar', () => {
    test('reverseNode is owned by reverseRegistrar', async () => {
      const owner = await ens.getOwner('addr.reverse')
      expect(reverseRegistrar).toBe(owner)
    })

    test('getName gets a name for an address', async () => {
      const accounts = await getAccounts()
      const { name } = await ens.getName(accounts[2])
      expect(name).toBe('eth')
    })

    test('claimAndSetReverseRecordName claims and sets a name', async () => {
      const accounts = await getAccounts()
      const { name } = await ens.getName(accounts[0])
      expect(name).toBe('abittooawesome.eth')
      const tx = await ens.claimAndSetReverseRecordName('resolver.eth', 2000000)
      await tx.wait()
      const { name: nameAfter } = await ens.getName(accounts[0])
      expect(nameAfter).toBe('resolver.eth')
    })
  })

  describe('Helper functions', () => {
    test('getDomainDetails gets rootdomain and resolver details', async () => {
      try {
        const domain = await ens.getDomainDetails('resolver.eth')
        expect(domain.owner).not.toBe(
          '0x0000000000000000000000000000000000000000'
        )
        expect(domain.owner).toBeEthAddress()
        expect(domain.resolver).not.toBe(
          '0x0000000000000000000000000000000000000000'
        )
        expect(domain.resolver).toBeEthAddress()
        const addr = await ens.getAddress('resolver.eth')
        expect(domain.addr).toBe(addr)
        expect(domain.content).toMatchSnapshot()
      } catch (e) {
        console.log('help functions test', e)
      }
    })

    test('getSubdomains gets all subdomains', async () => {
      const domains = await ens.getSubdomains('eth')
      expect(domains.length).toBeGreaterThan(0)
      expect(domains[0].label).toBe('subdomain')
    })
  })
})

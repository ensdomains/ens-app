import has from 'lodash/has'
import { Contract, utils } from 'ethers'
import Web3 from 'web3'
import {
  getWeb3,
  getNetworkId,
  getProvider,
  getAccount,
  getSigner
} from './web3'
import { formatsByName } from '@ensdomains/address-encoder'

import { decryptHashes } from './preimage'

import {
  uniq,
  getEnsStartBlock,
  checkLabels,
  mergeLabels,
  emptyAddress,
  isDecrypted,
  namehash,
  labelhash
} from './utils'
import { encodeLabelhash } from './utils/labelhash'

import { getSNSContract } from './contracts'
import { nameRemoveSuffix } from './utils/namehash'

/* Utils */

export function getNamehash(name) {
  return namehash(name)
}

async function getNamehashWithLabelHash(labelHash, nodeHash) {
  let node = utils.keccak256(nodeHash + labelHash.slice(2))
  return node.toString()
}

function getLabelhash(label) {
  return labelhash(label)
}

const contracts = {
  1: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  3: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  4: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  5: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  137: {
    registry: '0xcF0D2916e75ea41b324a29cd7C1175F045A57d41'
  }
}

export class SNS {
  constructor({ networkId, registryAddress, provider }) {
    this.contracts = contracts
    const hasRegistry = has(this.contracts[networkId], 'registry')

    if (!hasRegistry && !registryAddress) {
      throw new Error(`Unsupported network ${networkId}`)
    } else if (this.contracts[networkId] && !registryAddress) {
      registryAddress = contracts[networkId].registry
    }

    this.registryAddress = registryAddress

    const SNSContract = getSNSContract({ address: registryAddress, provider })
    this.SNS = SNSContract
  }

  /* Get the raw Ethers contract object */
  getSNSContractInstance() {
    return this.SNS
  }

  /* Main methods */

  // async getOwner(name) {
  //   const namehash = getNamehash(name)
  //   const owner = await this.SNS.owner(namehash)
  //   return owner
  // }

  /* non-constant functions */

  // async setOwner(name, newOwner) {
  //   const SNSWithoutSigner = this.SNS
  //   const signer = await getSigner()
  //   const SNS = SNSWithoutSigner.connect(signer)
  //   const namehash = getNamehash(name)
  //   return SNS.setOwner(namehash, newOwner)
  // }

  async isOverDeadline() {
    const SNSWithoutSigner = this.SNS
    const signer = await getSigner()
    const SNS = SNSWithoutSigner.connect(signer)
    return await this.SNS.isOverDeadline()
  }

  //Get the number of castings that the system has cast
  async getWhitelist(address) {
    return await this.SNS.getWhitelist(address)
  }

  //Get the number of castings in the system
  async getTokenMintedExpManager() {
    return await this.SNS.getTokenMintedExpManager()
  }

  //Set the resolver address
  async setDefaultResolverAddress(addr) {
    return await this.SNS.setDefaultResolverAddress(addr)
  }

  //registry
  async registry(name) {
    const signer = await getSigner()
    const SNS = this.SNS.connect(signer)
    const account = await getAccount()
    let flag = (await SNS.isOverDeadline()) && (await SNS.getWhitelist(account))
    if (flag) {
      return await SNS.freeMint(nameRemoveSuffix(name))
    } else {
      const value = await this.getRegisteredPrice()
      return await SNS.mint(nameRemoveSuffix(name), { value })
    }
  }

  //freeMint
  async freeMint(name) {
    return await this.SNS.freeMint(nameRemoveSuffix(name))
  }

  //Paid regist
  async mint(name) {
    return await this.SNS.mint(nameRemoveSuffix(name))
  }

  // sns name transfer
  async transfer(name, address) {
    const signer = await getSigner()
    const SNS = this.SNS.connect(signer)
    return SNS.transfer(nameRemoveSuffix(name), address)
  }

  //Get the registered SNSName by address
  async getSNSName(address) {
    return await this.SNS.getSNSName(address)
  }

  //Get the resolver address through SNSName
  async getResolverAddress(name) {
    return await this.SNS.getResolverAddress(name)
  }

  //
  async setResolverInfo(name, address) {
    const signer = await getSigner()
    const SNS = this.SNS.connect(signer)
    return SNS.setResolverInfo(nameRemoveSuffix(name), address)
  }

  //Get resolverOwner address
  async getResolverOwner(name) {
    return await this.SNS.getResolverOwner(name)
  }

  async getDomainDetails(name) {
    const labelhash = getLabelhash(name)
    const signer = await getSigner()
    const SNS = this.SNS.connect(signer)
    const [owner, resolver] = await Promise.all([
      SNS.getResolverOwner(name),
      SNS.getResolverAddress(name)
    ])
    const node = {
      name,
      label: name.split('.key')[0],
      labelhash,
      owner,
      resolver
    }

    // const hasResolver = parseInt(node.resolver, 16) !== 0

    // if (hasResolver) {
    //   return this.getResolverDetails(node)
    // }

    return {
      ...node,
      addr: null,
      content: null
    }
  }

  //
  async getRegisteredPrice() {
    const count = await this.SNS.getTokenMintedExpManager()
    let price
    if (count.toNumber() <= 10000) {
      price = Web3.utils.toWei('1', 'ether')
    } else {
      price = Web3.utils.toWei('10', 'ether')
    }
    return price
  }
  // Events

  /**
   event FreeMint(address sender_,string name_);
   event Mint(address sender_,string name_);
   event SetResolverInfo(address sender_, string name_, address resolverAddress_);
   event TransferName(address sender_, address form_, address to_, string name_);
   */
  async getSNSEvent(event, { topics, fromBlock }) {
    const provider = await getWeb3()
    const { SNS } = this
    const ensInterface = new utils.Interface(ensContract)
    let Event = SNS.filters[event]()

    const filter = {
      fromBlock,
      toBlock: 'latest',
      address: Event.address,
      topics: [...Event.topics, ...topics]
    }

    const logs = await provider.getLogs(filter)

    const parsed = logs.map(log => {
      const parsedLog = ensInterface.parseLog(log)
      return parsedLog
    })

    return parsed
  }
}

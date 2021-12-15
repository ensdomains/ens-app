import has from 'lodash/has'
import { Contract, utils } from 'ethers'
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
    registry: '0x23764364fb8db7257a36E053B780Ff33D0622b92'
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
    return await this.SNS.isOverDeadline()
  }

  //Query the number of castings that the system has cast
  async getWhitelist(address) {
    return await this.SNS.getWhitelist(address)
  }

  //Query the number of castings in the system
  async getTokenMintedExpManager() {
    return await this.SNS.getTokenMintedExpManager()
  }

  //Set the resolver address
  async setDefaultResolverAddress(addr) {
    return await this.SNS.setDefaultResolverAddress(addr)
  }

  //registry
  async registry(address, name, tokenURI) {
    var flag = false
    flag =
      isOverDeadline() &&
      getWhitelist(address) &&
      getTokenMintedExpManager() <= 10000
    if (flag) {
      return await freeMint(name, tokenURI)
    } else {
      //todo set value
      return await mint(name, tokenURI)
    }
  }

  //freeMint
  async freeMint(name, tokenURI) {
    return await this.SNS.freeMint(name, tokenURI)
  }

  //Paid regist
  async mint(name, tokenURI) {
    return await this.SNS.mint(name, tokenURI)
  }

  //Get the registered SNSName by address
  async getSNSName(address) {
    return await this.SNS.getSNSName(address)
  }

  //Get the resolver address through SNSName
  async getResolverAddress(name) {
    return await this.SNS.getResolverAddress(name)
  }

  //Set the resolver address
  async setResolverInfo(name, address) {
    return await this.SNS.setResolverInfo(name)
  }

  // Events

  async getSNSEvent(event, { topics, fromBlock }) {
    return parsed
  }
}

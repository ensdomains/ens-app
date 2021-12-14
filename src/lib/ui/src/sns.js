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
    registry: '0x01625719fe33e919da1cd4860388a789068ccf49'
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

  //查询是否过了前三天
  async isOverDeadline() {
    return await this.SNS.isOverDeadline()
  }

  //查询用户是否在白名单中
  async getWhitelist(address) {
    return await this.SNS.getWhitelist(address)
  }

  //查询系统已经铸造的个数
  async getTokenMintedExpManager() {
    return await this.SNS.getTokenMintedExpManager()
  }

  //设置解析器地址
  async setDefaultResolverAddress(addr) {
    return await this.SNS.setDefaultResolverAddress(addr)
  }

  //注册
  async registry(address, name, tokenURI) {
    var flag = false
    flag =
      isOverDeadline() &&
      getWhitelist(address) &&
      getTokenMintedExpManager() <= 10000
    if (flag) {
      return await freeMint(name, tokenURI)
    } else {
      //todo 设置value
      return await mint(name, tokenURI)
    }
  }

  //免费注册
  async freeMint(name, tokenURI) {
    return await this.SNS.freeMint(name, tokenURI)
  }

  //付费注册
  async mint(name, tokenURI) {
    return await this.SNS.mint(name, tokenURI)
  }

  //通过地址得到注册的SNSName
  async getSNSName(address) {
    return await this.SNS.getSNSName(address)
  }

  //通过SNSName得到解析器地址
  async getResolverAddress(name) {
    return await this.SNS.getResolverAddress(name)
  }

  //设置解析器地址
  async setResolverInfo(name, address) {
    return await this.SNS.setResolverInfo(name)
  }

  // Events

  async getSNSEvent(event, { topics, fromBlock }) {
    return parsed
  }
}

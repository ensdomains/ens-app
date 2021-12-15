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

import { getSNSResolverContract } from './contracts'

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

export class SNSResolver {
  constructor({ networkId, resolverAddress, provider }) {
    this.contracts = contracts
    // const hasRegistry = has(this.contracts[networkId], 'registry')

    // if (!hasRegistry && !registryAddress) {
    //   throw new Error(`Unsupported network ${networkId}`)
    // } else if (this.contracts[networkId] && !registryAddress) {
    //   registryAddress = contracts[networkId].registry
    // }

    // this.resolverAddress = resolverAddress

    const SNSResolverContract = getSNSResolverContract({
      address: resolverAddress,
      provider
    })
    this.SNSResolver = SNSResolverContract
  }

  /* Get the raw Ethers contract object */
  getSNSResolverContractInstance() {
    return this.SNSResolver
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

  //ETH
  async getEthAddress(name) {
    return await this.SNSResolver.getEthAddress(name)
  }
  async setEthAddress(name, ethAddress) {
    return await this.SNSResolver.setEthAddress(name, ethAddress)
  }

  //BTC
  async getBtcAddress(name) {
    return await this.SNSResolver.getBtcAddress(name)
  }
  async setBtcAddress(name, btcAddress) {
    return await this.SNSResolver.setBtcAddress(name, btcAddress)
  }

  //LTC
  async getLtcAddress(name) {
    return await this.SNSResolver.getLtcAddress(name)
  }
  async setLtcAddress(name, ltcAddress) {
    return await this.SNSResolver.setLtcAddress(name, ltcAddress)
  }

  //DOGE
  async getDogeAddress(name) {
    return await this.SNSResolver.getDogeAddress(name)
  }
  async setDogeAddress(name, dogeAddress) {
    return await this.SNSResolver.setDogeAddress(name, dogeAddress)
  }

  //ipfs
  async getIpfs(name) {
    return await this.SNSResolver.getIpfs(name)
  }
  async setIpfs(name, ipfs) {
    return await this.SNSResolver.setIpfs(name, ipfs)
  }

  //url
  async getUrl(name) {
    return await this.SNSResolver.getUrl(name)
  }
  async setUrl(name, url) {
    return await this.SNSResolver.setUrl(name, url)
  }

  //email
  async getEmail(name) {
    return await this.SNSResolver.getEmail(name)
  }
  async setEmail(name, email) {
    return await this.SNSResolver.setEmail(name, email)
  }

  //avator
  async getAvator(name) {
    return await this.SNSResolver.getAvator(name)
  }
  async setAvator(name, avator) {
    return await this.SNSResolver.setAvator(name, avator)
  }

  //description
  async getDescription(name) {
    return await this.SNSResolver.getDescription(name)
  }
  async setDescription(name, description) {
    return await this.SNSResolver.setDescription(name, description)
  }

  //notice
  async getNotice(name) {
    return await this.SNSResolver.getNotice(name)
  }
  async setNotice(name, notice) {
    return await this.SNSResolver.getNotice(name, notice)
  }

  //keywords
  async getKeywords(name) {
    return await this.SNSResolver.getKeywords(name)
  }
  async setKeywords(name, keywords) {
    return await this.SNSResolver.setKeywords(name, keywords)
  }

  //comGithub
  async getComGithub(name) {
    return await this.SNSResolver.getComGithub(name)
  }
  async setComGithub(name, comGithub) {
    return await this.SNSResolver.setComGithub(name, comGithub)
  }

  //comReddit
  async getComReddit(name) {
    return await this.SNSResolver.getComReddit(name)
  }
  async setComReddit(name, comReddit) {
    return await this.SNSResolver.setComReddit(name, comReddit)
  }

  //comTwitter
  async getComTwitter(name) {
    return await this.SNSResolver.getComTwitter(name)
  }
  async setComTwitter(name, comTwitter) {
    return await this.SNSResolver.setComTwitter(name, comTwitter)
  }

  //orgTelegram
  async getOrgTelegram(name) {
    return await this.SNSResolver.getOrgTelegram(name)
  }
  async setOrgTelegram(name, orgTelegram) {
    return await this.SNSResolver.setOrgTelegram(name, orgTelegram)
  }
}

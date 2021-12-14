import { Contract } from 'ethers'
import {
  BaseRegistrarImplementation as permanentRegistrarContract,
  BulkRenewal as bulkRenewalContract,
  ENS as ensContract,
  ETHRegistrarController as permanentRegistrarControllerContract,
  DNSRegistrar as dnsRegistrarContract,
  Resolver as resolverContract,
  ReverseRegistrar as reverseRegistrarContract,
  TestRegistrar as testRegistrarContract
} from '@ensdomains/ens-contracts'

import { abi as oldResolverContract } from '@ensdomains/contracts/abis/ens-022/PublicResolver.json'
import { abi as dnsRegistrarContractOld } from '@ensdomains/contracts/abis/dnsregistrar/DNSRegistrar.json'
import { abi as legacyAuctionRegistrarContract } from '@ensdomains/contracts/abis/ens/HashRegistrar'
import { abi as deedContract } from '@ensdomains/contracts/abis/ens/Deed'

import snsContract from './sns.json'
import snsResolverContract from './sns.resolver.json'

function getReverseRegistrarContract({ address, provider }) {
  return new Contract(address, reverseRegistrarContract, provider)
}

function getResolverContract({ address, provider }) {
  return new Contract(address, resolverContract, provider)
}

function getOldResolverContract({ address, provider }) {
  return new Contract(address, oldResolverContract, provider)
}

function getENSContract({ address, provider }) {
  return new Contract(address, ensContract, provider)
}

function getSNSContract({ address, provider }) {
  return new Contract(address, snsContract, provider)
}

function getSNSResolverContract({ address, provider }) {
  return new Contract(address, snsResolverContract, provider)
}

function getTestRegistrarContract({ address, provider }) {
  return new Contract(address, testRegistrarContract, provider)
}

function getOldDnsRegistrarContract({ parentOwner, provider }) {
  return new Contract(parentOwner, dnsRegistrarContractOld, provider)
}

function getDnsRegistrarContract({ parentOwner, provider }) {
  return new Contract(parentOwner, dnsRegistrarContract, provider)
}

function getPermanentRegistrarContract({ address, provider }) {
  return new Contract(address, permanentRegistrarContract, provider)
}

function getPermanentRegistrarControllerContract({ address, provider }) {
  return new Contract(address, permanentRegistrarControllerContract, provider)
}

function getDeedContract({ address, provider }) {
  return new Contract(address, deedContract, provider)
}

function getLegacyAuctionContract({ address, provider }) {
  return new Contract(address, legacyAuctionRegistrarContract, provider)
}

function getBulkRenewalContract({ address, provider }) {
  return new Contract(address, bulkRenewalContract, provider)
}

export {
  getTestRegistrarContract,
  getReverseRegistrarContract,
  getENSContract,
  getResolverContract,
  getOldResolverContract,
  getDnsRegistrarContract,
  getOldDnsRegistrarContract,
  getPermanentRegistrarContract,
  getPermanentRegistrarControllerContract,
  getLegacyAuctionContract,
  getDeedContract,
  getBulkRenewalContract,
  getSNSContract,
  getSNSResolverContract
}

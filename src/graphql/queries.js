import { gql } from '@apollo/client'
import { NodeFields, SubDomainStateFields } from './fragments'

export const GET_PUBLIC_RESOLVER = gql`
  query publicResolver {
    publicResolver {
      address
    }
  }
`

export const GET_REVERSE_RECORD = gql`
  query getReverseRecord($address: String) {
    getReverseRecord(address: $address) {
      name
      address
      avatar
      match
    }
  }
`

export const GET_OWNER = gql`
  query getOwner($name: String) {
    getOwner(name: $name)
  }
`

export const GET_TEXT = gql`
  query getText($name: String, $key: String) {
    getText(name: $name, key: $key)
  }
`

export const GET_ADDRESSES = gql`
  query getAddresses($name: String, $keys: [String]) {
    getAddresses(name: $name, keys: $keys)
  }
`

export const GET_TEXT_RECORDS = gql`
  query getTextRecords($name: String, $keys: [String]) {
    getTextRecords(name: $name, keys: $keys)
  }
`

export const GET_SINGLE_NAME = gql`
  query singleName($name: String) {
    singleName(name: $name) {
      ...NodeFields
      revealDate
      registrationDate
      migrationStartDate
      currentBlockDate
      transferEndDate
      gracePeriodEndDate
      value
      highestBid
      state
      stateError
      price
      rent
      referralFeePPM
      available
      expiryTime
      deedOwner
      registrant
      isNewRegistrar
      isDNSRegistrar
      dnsOwner
    }
  }

  ${NodeFields}
`

export const GET_RESOLVER_MIGRATION_INFO = gql`
  query getResolverMigrationInfo($name: String, $resolver: String) {
    getResolverMigrationInfo(name: $name, resolver: $resolver) {
      name
      isDeprecatedResolver
      isOldPublicResolver
      isPublicResolverReady
    }
  }
`

export const GET_SUBDOMAINS = gql`
  query getSubDomains($name: String!) {
    getSubDomains(name: $name) {
      subDomains
    }
  }
`

export const GET_META_BLOCK_NUMBER_FROM_GRAPH = gql`
  query getMetaBlockNumber {
    _meta {
      block {
        number
      }
    }
  }
`

export const GET_RESOLVER_FROM_SUBGRAPH = gql`
  query getResolverFromSubgraph($id: ID!) {
    domain(id: $id) {
      id
      name
      resolver {
        coinTypes
        texts
      }
    }
  }
`

export const GET_REGISTRANT_FROM_SUBGRAPH = gql`
  query getRegistrantFromSubgraph($id: ID!) {
    registration(id: $id) {
      id
      domain {
        name
      }
      registrant {
        id
      }
    }
  }
`

export const GET_SUBDOMAINS_FROM_SUBGRAPH = gql`
  query getSubdomains($id: ID!) {
    domain(id: $id) {
      id
      labelName
      subdomains {
        id
        labelName
        labelhash
        isMigrated
        name
        owner {
          id
        }
      }
    }
  }
`

export const GET_ETH_RECORD_AVAILABLE_NAMES_FROM_SUBGRAPH = gql`
  query getNamesFromSubgraph($address: String!) {
    domains(first: 1000, where: { resolvedAddress: $address }) {
      name
    }
  }
`

export const GET_TRANSACTION_HISTORY = gql`
  query getTransactionHistory @client {
    transactionHistory
  }
`

export const WAIT_BLOCK_TIMESTAMP = gql`
  query waitBlockTimestamp($waitUntil: Int) {
    waitBlockTimestamp(waitUntil: $waitUntil)
  }
`

export const GET_BALANCE = gql`
  query getBalance($address: String) {
    getBalance(address: $address)
  }
`

export const GET_FAVOURITES = gql`
  query getFavourites {
    favourites @client {
      name
    }
  }
`

export const GET_SUBDOMAIN_FAVOURITES = gql`
  query getSubDomainFavourites {
    subDomainFavourites @client {
      name
    }
  }

  ${SubDomainStateFields}
`

export const GET_ERRORS = gql`
  query getErrors @client {
    globalError
  }
`

/* Subgraph only queries */

export const GET_REGISTRATIONS_SUBGRAPH = gql`
  query getRegistrations(
    $id: ID!
    $first: Int
    $skip: Int
    $orderBy: Registration_orderBy
    $orderDirection: OrderDirection
    $expiryDate: Int
  ) {
    account(id: $id) {
      registrations(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: { expiryDate_gt: $expiryDate }
      ) {
        expiryDate
        domain {
          id
          labelName
          labelhash
          name
          isMigrated
          parent {
            name
          }
        }
      }
    }
  }
`

export const GET_REGISTRATIONS_BY_IDS_SUBGRAPH = gql`
  query getRegistrationsById($ids: [ID]) {
    registrations(first: 1000, where: { domain_in: $ids }) {
      expiryDate
      registrant {
        id
      }
      domain {
        id
        name
      }
    }
  }
`

export const GET_DOMAINS_SUBGRAPH = gql`
  query getDomains(
    $id: ID!
    $first: Int
    $skip: Int
    $orderBy: Domain_orderBy
  ) {
    account(id: $id) {
      domains(first: $first, skip: $skip, orderBy: $orderBy) {
        labelName
        labelhash
        name
        isMigrated
        parent {
          name
        }
      }
    }
  }
`

/* Permanent Registrar */

export const GET_ETH_PRICE = gql`
  query getEthPrice {
    getEthPrice
  }
`

export const GET_PRICE_CURVE = gql`
  query getPriceCurve {
    getPriceCurve
  }
`

export const GET_RENT_PRICE = gql`
  query getRentPrice($label: String, $duration: Number) {
    getRentPrice(label: $label, duration: $duration)
  }
`

export const GET_RENT_PRICE_AND_PREMIUM = gql`
  query getRentPriceAndPremium(
    $name: String
    $expires: Number
    $duration: Number
  ) {
    getRentPriceAndPremium(name: $name, expires: $expires, duration: $duration)
  }
`
export const GET_RENT_PRICES = gql`
  query getRentPrices($labels: String, $duration: Number) {
    getRentPrices(labels: $labels, duration: $duration)
  }
`

export const GET_PREMIUM = gql`
  query getPremium($name: String, $expires: Number, $duration: Number) {
    getPremium(name: $name, expires: $expires, duration: $duration)
  }
`

export const GET_TIME_UNTIL_PREMIUM = gql`
  query getTimeUntilPremium($expires: Number, $amount: Number) {
    getTimeUntilPremium(expires: $expires, amount: $amount)
  }
`

export const GET_MINIMUM_COMMITMENT_AGE = gql`
  query getMinimumCommitmentAge {
    getMinimumCommitmentAge
  }
`

export const GET_MAXIMUM_COMMITMENT_AGE = gql`
  query getMaximumCommitmentAge {
    getMaximumCommitmentAge
  }
`

export const CHECK_COMMITMENT = gql`
  query checkCommitment(
    $label: String
    $secret: String
    $commitmentTimerRunning: String
  ) {
    checkCommitment(
      label: $label
      secret: $secret
      commitmentTimerRunning: $commitmentTimerRunning
    )
  }
`

/* Registry Migration */

export const CAN_WRITE = gql`
  query canWrite($name: String, $account: String) {
    canWrite(name: $name, account: $account)
  }
`

export const IS_MIGRATED = gql`
  query isMigrated($name: String) {
    isMigrated(name: $name)
  }
`

export const IS_CONTRACT_CONTROLLER = gql`
  query isContractController($address: String) {
    isContractController(address: $address)
  }
`

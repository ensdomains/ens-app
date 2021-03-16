const typeDefs = `
  # Root resolver
  type Web3 {
    accounts: [String]
  }

  enum TransactionMode{
    Pending
    Confirmed
  }

  type Transaction {
    txHash: String
    txState: TransactionMode
    createdAt: Int
    updatedAt: Int
  }

  type Query {
    web3: Web3
  }

  # Eth Registrar

  enum Mode { 
    Open 
    Auction
    Owned
    Forbidden
    Reveal
    NotYetAvailable 
  }

  type DomainState {
    name: String
    state: Mode
  }

  type Bid {
    name: String
    amount: Int
  }

  extend type Query {
    domainState: DomainState
  }

  type Mutation {
    getDomainAvailability(name: String!): DomainState
    bid(name: String, bidAmount: Int, decoyBidAmount: Int, secret: String): Transaction
  }

  # Manager

  type Node {
    name: String
    label: String
    owner: String
    resolver: String
    content: String
    contentType: String
    addr: String
    nodes: [Node]
    expiryTime: Int
    migrationStartDate: Int
    currentBlockDate: Int
    transferEndDate: Int
    gracePeriodEndDate: Int
    isNewRegistrar: Boolean
    isDNSRegistrar: Boolean
    stateError: String
    dnsOwner: String
  }

  extend type Query {
    nodes: [Node]
  }

  extend type Mutation {
    getSubdomains(name: String): [Node]
  }

  # Test Registrar
  
  extend type Mutation {
    registerTestDomain(name: String!): Transaction
  }

  # SubDomain Registrar

  type SubDomainState {
    label: String
    domain: String
    price: String
    rent: String
    referralFeePPM: String
    available: Boolean
  }

  extend type Mutation {
    getSubDomainState(name: String!): [SubDomainState]
  }

  extend type Query {
    subDomainState: [SubDomainState]
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

export default typeDefs

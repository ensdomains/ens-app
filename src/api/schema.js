const typeDefs = `
  # Root resolver
  type Web3 {
    accounts: [String]
  }

  type Transaction {
    id: String
    createdAt: String
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
    addr: String
    nodes: [Node]
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

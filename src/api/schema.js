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

  type NodeState {
    name: String
    state: Mode
  }

  extend type Query {
    domainState: DomainState
  }

  type Mutation {
    getDomainState(name: String!): NodeState
  }

  # Manager

  type Node {
    name: String
    label: String
    owner: String
    resolver: String
    nodes: [Node]
  }

  extend type Query {
    nodes: [Node]
  }

  # Test Registrar
  
  extend type Mutation {
    registerTestDomain(name: String!): Transaction
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

export default typeDefs

const typeDefs = `
  type User {
    id: ID!
    name: String!
    image: String!
    avatar: Avatar
  }
  type Avatar {
    url: String!
  }
  type Web3 {
    accounts: [String]
  }

  type Transaction {
    id: String
    createdAt: String
  }

  enum Mode { 
    Open 
    Auction
    Owned
    Forbidden
    Reveal
    NotYetAvailable 
  }

  type NodeState {
    name: String
    state: Mode
  }

  type Node {
    name: String
    label: String
    owner: String
    resolver: String
    nodes: [Node]
  }

  type Query {
    nodes: [Node]
    people: [User]
    web3: Web3
  }

  type Mutation {
    registerTestDomain(name: String!): Transaction
    getDomainState(name: String!): NodeState
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

export default typeDefs

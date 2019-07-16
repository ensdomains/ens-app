import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

import resolvers, { defaults } from './api/rootResolver'
import typeDefs from './api/schema'

let client

const cache = new InMemoryCache({
  addTypename: true
})

const endpoints = {
  '1': 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  '3': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
  '5': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli'
}

async function getNetwork() {
  let network

  if (window.ethereum) {
    network = window.ethereum.networkVersion
  } else if (window.web3) {
    network = await new Promise((resolve, reject) => {
      window.version.web3.getNetwork((err, network) => {
        resolve(network)
      })
    })
  }

  return network
}

function getGraphQLAPI(network) {
  if (endpoints[network]) {
    return endpoints[network]
  } else if (process.env.REACT_APP_GRAPH_NODE_URI) {
    return process.env.REACT_APP_GRAPH_NODE_URI
  } else {
    return endpoints['1']
  }
}

const stateLink = withClientState({
  resolvers,
  cache,
  defaults,
  typeDefs
})

export async function setupClient() {
  const network = await getNetwork()

  const httpLink = new HttpLink({
    uri: getGraphQLAPI(network)
  })

  client = new ApolloClient({
    cache,
    addTypename: true,
    link: ApolloLink.from([stateLink, httpLink], cache)
  })
  return client
}

export default function getClient() {
  return client
}

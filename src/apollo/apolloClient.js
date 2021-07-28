import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split
} from '@apollo/client'
import Observable from 'zen-observable'

import resolvers from '../api/rootResolver'
import typePolicies from './typePolicies'

let client

const cache = new InMemoryCache({
  typePolicies
})

const endpoints = {
  '1': 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  '3': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
  '4': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
  '5': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli'
}

function getGraphQLAPI(network) {
  if (network > 100 && process.env.REACT_APP_GRAPH_NODE_URI) {
    return process.env.REACT_APP_GRAPH_NODE_URI
  }

  if (endpoints[network]) {
    return endpoints[network]
  }

  return endpoints['1']
}

function fromPromise(promise, operation) {
  return new Observable(observer => {
    promise
      .then(value => {
        operation.setContext({ response: value })
        observer.next({
          data: { [operation.operationName]: value },
          errors: []
        })
        observer.complete()
        console.log('observer: ', observer)
        console.log('value: ', value)
      })
      .catch(observer.error.bind(observer))
  })
}

export function setupClient(network) {
  const httpLink = new HttpLink({
    uri: getGraphQLAPI(network)
  })
  const web3Link = new ApolloLink(operation => {
    const { variables, operationName } = operation
    return fromPromise(
      resolvers.Query[operationName]?.apply(null, [null, variables]),
      operation
    )
  })
  const splitLink = split(
    ({ operationName }) => {
      return resolvers.Query[operationName] || resolvers.Mutation[operationName]
    },
    web3Link,
    httpLink
  )

  const option = {
    cache,
    link: splitLink
  }

  client = new ApolloClient(option)
  return client
}

export default function getClient() {
  return client
}

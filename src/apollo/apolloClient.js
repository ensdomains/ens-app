import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split
} from '@apollo/client'
import Observable from 'zen-observable'
import gql from 'graphql-tag'

import resolvers from '../api/rootResolver'
import typePolicies from './typePolicies'
import { networkIdReactive } from './reactiveVars'

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

function getGraphQLAPI() {
  const network = networkIdReactive()
  // const network = 200;
  console.log('>>>: ', process.env.REACT_APP_GRAPH_NODE_URI)
  console.log('network: ', network)

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
    uri: () => getGraphQLAPI()
  })

  const web3Link = new ApolloLink(operation => {
    const { variables, operationName } = operation
    console.log('operationname: ', operationName)

    if (resolvers.Query[operationName]) {
      return fromPromise(
        resolvers.Query[operationName]?.apply(null, [null, variables]),
        operation
      )
    }

    return fromPromise(
      resolvers.Mutation[operationName]?.apply(null, [null, variables]),
      operation
    )
  })

  const splitLink = split(
    ({ operationName }) => {
      console.log(
        'web3link, ',
        operationName,
        resolvers.Query[operationName] || resolvers.Mutation[operationName]
      )
      console.log('resolvers: ', resolvers)
      return resolvers.Query[operationName] || resolvers.Mutation[operationName]
    },
    web3Link,
    httpLink
  )

  const typeDefs = gql`
    extend type Query {
      networkId: String! @client
      web3: String @client
    }
  `

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

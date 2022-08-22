import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
  concat
} from '@apollo/client'
import Observable from 'zen-observable'
import { visit } from 'graphql'
import traverse from 'traverse'
import namehash from '@ensdomains/eth-ens-namehash'

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
      })
      .catch(e => {
        console.error('fromPromise error: ', e)
        observer.error.bind(observer)
      })
  })
}

const generateSelection = selection => ({
  kind: 'Field',
  name: {
    kind: 'Name',
    value: selection
  },
  arguments: [],
  directives: [],
  alias: undefined,
  selectionSet: undefined
})

export const enter = node => {
  // @return
  //   undefined: no action
  //   false: skip visiting this node
  //   visitor.BREAK: stop visiting altogether
  //   null: delete this node
  //   any value: replace this node with the returned value

  if (node.kind === 'SelectionSet') {
    const id = node.selections.find(x => x.name && x.name.value === 'id')
    const name = node.selections.find(x => x.name && x.name.value === 'name')

    if (!id && name) {
      node.selections = [...node.selections, generateSelection('id')]
      return node
    }
  }
}

export const updateResponse = response => {
  traverse(response).forEach(function(responseItem) {
    if (responseItem instanceof Object && responseItem.name) {
      //Name already in hashed form
      if (responseItem.name && responseItem.name.includes('[')) {
        return
      }

      let hashedName
      try {
        hashedName = namehash.hash(responseItem.name)
      } catch (e) {
        return
      }

      if (responseItem.id !== hashedName) {
        this.update({ ...responseItem, name: hashedName, invalidName: true })
      }
    }
  })
  return response
}

const namehashCheckLink = new ApolloLink((operation, forward) => {
  const updatedQuery = visit(operation.query, { enter })
  operation.query = updatedQuery
  return forward(operation).map(updateResponse)
})

export function setupClient() {
  const httpLink = new HttpLink({
    uri: () => getGraphQLAPI()
  })

  const web3Link = new ApolloLink(operation => {
    const { variables, operationName } = operation

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
      return resolvers.Query[operationName] || resolvers.Mutation[operationName]
    },
    web3Link,
    concat(namehashCheckLink, httpLink)
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

import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { usePrevious } from '../utils/utils'
import { getReverseRecordMutation } from '../apollo/mutations/mutations'
import getClient from '../apollo/apolloClient'
import { GET_REGISTRATIONS_SUBGRAPH } from '../graphql/queries'
import typePolicies from '../apollo/typePolicies'

import resolvers from '../api/rootResolver'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    accounts
    networkId
  }
`

export default () => {
  const {
    data: { accounts, networkId }
  } = useQuery(REACT_VAR_LISTENERS)

  const previousNetworkId = usePrevious(networkId)

  useEffect(() => {
    getReverseRecordMutation(accounts?.[0])
  }, [accounts])

  useEffect(() => {
    console.log('previousNetworkId: ', previousNetworkId)
    if (previousNetworkId !== networkId && previousNetworkId !== undefined) {
      // console.log('networkId changed: ', networkId)
      //console.log('client: ', getClient())
      const client = getClient()
      // console.log('observableQueries: ', client.getObservableQueries("reactiveVarListeners"))
      // const observableQueries = client.getObservableQueries("active");
      // const queries = []
      // for (var x of observableQueries) {
      //   console.log(x)
      //   queries.push(x[0])
      // }
      // console.log('queries: ', queries)
      client
        .refetchQueries({
          include: ['getRegistrations']
        })
        .then(x => console.log('refetch: ', x))
    }
  }, [networkId])
}

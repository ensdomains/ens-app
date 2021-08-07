import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { usePrevious } from '../utils/utils'
import { getReverseRecordMutation } from '../apollo/mutations/mutations'
import getClient from '../apollo/apolloClient'
import {
  GET_REGISTRATIONS_SUBGRAPH,
  GET_REGISTRATIONS_BY_IDS_SUBGRAPH
} from '../graphql/queries'
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
    if (previousNetworkId !== networkId && previousNetworkId !== undefined) {
      const client = getClient()

      client
        .refetchQueries({
          include: ['getRegistrations', 'getRegistrationsById'],
          onQueryUpdated(observableQuery, diff, lastDiff) {
            return true
          }
        })
        .catch(e => console.error('refetch error: ', e))
    }
  }, [networkId])
}

//'getRegistrations',

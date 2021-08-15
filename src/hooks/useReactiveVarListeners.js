import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { reverseRecordReactive } from '../apollo/reactiveVars'
import { usePrevious } from '../utils/utils'
import getClient from '../apollo/apolloClient'
import { getReverseRecord } from '../apollo/sideEffects'

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
    const run = async () => {
      reverseRecordReactive(await getReverseRecord(accounts?.[0]))
    }
    run()
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

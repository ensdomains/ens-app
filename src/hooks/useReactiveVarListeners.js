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
    isENSReady
  }
`

export default () => {
  const {
    data: { accounts, networkId, isENSReady }
  } = useQuery(REACT_VAR_LISTENERS)

  const previousNetworkId = usePrevious(networkId)

  useEffect(() => {
    const run = async () => {
      reverseRecordReactive(await getReverseRecord(accounts?.[0]))
    }
    if (isENSReady) {
      run()
    }
  }, [accounts, isENSReady])

  useEffect(() => {
    if (previousNetworkId !== networkId && previousNetworkId !== undefined) {
      const client = getClient()

      client
        .refetchQueries({
          include: ['getRegistrations', 'getRegistrationsById', 'singleName'],
          onQueryUpdated() {
            return true
          }
        })
        .catch(e => console.error('refetch error: ', e))
    }
  }, [networkId])
}

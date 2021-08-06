import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { usePrevious } from '../utils/utils'
import { getReverseRecordMutation } from '../apollo/mutations/mutations'
import getClient from '../apollo/apolloClient'
import { GET_REGISTRATIONS_SUBGRAPH } from '../graphql/queries'

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
      console.log('networkId changed')
      console.log('client: ', getClient())
      const client = getClient()
      debugger
      //getClient()?.reFetchObservableQueries()
      //getClient()?.query({ query: GET_REGISTRATIONS_SUBGRAPH })
    }
  }, [networkId])
}

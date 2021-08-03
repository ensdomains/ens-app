import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { getReverseRecordMutation } from '../apollo/mutations/mutations'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    accounts
  }
`

export default () => {
  const {
    data: { accounts }
  } = useQuery(REACT_VAR_LISTENERS)

  useEffect(() => {
    getReverseRecordMutation(accounts?.[0])
  }, [accounts])
}

import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    accounts
  }
`

export default () => {
  const { accounts } = useQuery(REACT_VAR_LISTENERS)

  useEffect(() => {}, [accounts])
}

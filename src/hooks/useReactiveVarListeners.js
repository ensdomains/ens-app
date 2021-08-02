import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeneers @client {
    accounts
  }
`

const useReactVarListeners = () => {
  const { accounts } = useQuery(REACT_VAR_LISTENERS)

  useEffect(() => {}, [accounts])
}

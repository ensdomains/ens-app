import { gql } from '@apollo/client'

export const GET_WEB3 = gql`
  query getweb3 @client {
    accounts
    isReadOnly
  }
`

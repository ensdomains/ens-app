import React from 'react'
import TEXT_RECORD_KEYS from 'constants/textRecords'
import KeyValueRecord from '../KeyValueRecord'
import { Query, useQuery } from 'react-apollo'
import { getNamehash } from '@ensdomains/ui'
import { GET_RESOLVER_FROM_SUBGRAPH } from 'graphql/queries'

const getPlaceholder = key => {
  return `Enter ${key}`
}

export default function TextRecords(props) {
  const { data } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(props.domain.name)
    }
  })
  let keys

  if (data && data.domain && data.domain.resolver.texts) {
    keys = data.domain.resolver.texts
  }

  return (
    <KeyValueRecord
      {...props}
      keys={keys || TEXT_RECORD_KEYS} // falls back to default if graph does not return anything
      getPlaceholder={getPlaceholder}
    />
  )
}

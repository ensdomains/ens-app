import React from 'react'
import { formatsByCoinType } from '@ensdomains/address-encoder'

import { COIN_LIST } from './constants'
import KeyValueRecord from '../KeyValueRecord'
import { validateRecord } from '../../../utils/records'
import { Query } from 'react-apollo'
import { GET_RESOLVER_RECORD_FROM_SUBGRAPH } from '../../../graphql/queries'
import { getNamehash } from '@ensdomains/ui'

const validator = (symbol, value) => {
  return validateRecord({
    type: 'otherAddresses',
    selectedKey: symbol,
    value
  })
}

const getPlaceholder = symbol => {
  return `Enter a ${symbol} address`
}

export default function Address(props) {
  return (
    <Query
      query={GET_RESOLVER_RECORD_FROM_SUBGRAPH}
      variables={{ id: getNamehash(props.domain.name) }}
    >
      {({ loading, error, data }) => {
        let coinList = []
        if (loading) {
          return <></>
        }
        const domain = data && data.domain
        if (error || !domain) {
          coinList = COIN_LIST
        } else {
          const resolver = domain.resolver
          const coinTypes = resolver && resolver.coinTypes
          if (coinTypes) {
            coinList = coinTypes.map(coinType => {
              return formatsByCoinType[coinType].name
            })
          }
        }
        return (
          <KeyValueRecord
            {...props}
            keys={coinList}
            validator={validator}
            getPlaceholder={getPlaceholder}
          />
        )
      }}
    </Query>
  )
}

import React, { useState } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import { GET_TRANSACTION_HISTORY } from '../graphql/queries'

import Loader from './Loader'

const PendingContainer = styled('div')`
  display: flex;
`

const Text = styled('span')`
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  margin-right: 10px;
`
const Pending = ({ className, children = 'Tx pending' }) => (
  <PendingContainer className={className}>
    <Text>{children}</Text>
    <Loader />
  </PendingContainer>
)

function MultiplePendingTx(txHashes) {
  const [txHashesStatus, setTxHashesStatus] = useState(txHashes)
  return (
    <Query query={GET_TRANSACTION_HISTORY}>
      {({ data: { transactionHistory } }) => {
        const lastTransaction = _.last(transactionHistory)
        txHashesStatus.forEach(txHash => {
          if (
            lastTransaction &&
            lastTransaction.txHash === txHash &&
            lastTransaction.txState === 'Confirmed'
          ) {
            const index = txHashesStatuses.findIndex(txHash)
            const newTxHashesStatus = [...txHashesStatus]
            newTxHashesStatus[index] = 1
            setTxHashesStatus(newTxHashesStatus)
          }

          if (
            newTxHashesStatus.reduce(acc, curr => acc + curr) ===
            newTxHashesStatus.length
          ) {
            onConfirmed()
          }
        })

        return <Pending {...this.props} />
      }}
    </Query>
  )
}

class PendingTx extends React.Component {
  render() {
    const { txHash, txHashes, onConfirmed } = this.props

    if (txHashes) {
      return <MultiplePendingTx txHashes={txHashes} onConfirmed={onConfirmed} />
    }
    return (
      <Query query={GET_TRANSACTION_HISTORY}>
        {({ data: { transactionHistory } }) => {
          const lastTransaction = _.last(transactionHistory)
          if (
            lastTransaction &&
            lastTransaction.txHash === txHash &&
            lastTransaction.txState === 'Confirmed'
          ) {
            onConfirmed()
          }
          return <Pending {...this.props} />
        }}
      </Query>
    )
  }
}

PendingTx.propTypes = {
  txHash: PropTypes.string,
  txHashes: PropTypes.array,
  onConfirmed: PropTypes.func
}

export default PendingTx

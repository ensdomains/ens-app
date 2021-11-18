import React, { useState, useEffect } from 'react'
import last from 'lodash/last'
import PropTypes from 'prop-types'
import styled from '@emotion/styled/macro'
import { useQuery } from '@apollo/client'
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

function MultiplePendingTx(props) {
  const { txHashes, onConfirmed } = props
  const [txHashesStatus, setTxHashesStatus] = useState(txHashes)
  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )
  txHashesStatus.forEach(txHash => {
    transactionHistory.forEach(tx => {
      if (tx && tx.txHash === txHash && tx.txState === 'Confirmed') {
        const index = txHashesStatus.findIndex(tx => tx === txHash)
        const newTxHashesStatus = [...txHashesStatus]
        newTxHashesStatus[index] = 1
        setTxHashesStatus(newTxHashesStatus)

        if (
          newTxHashesStatus.reduce((acc, curr) => acc + curr) ===
          newTxHashesStatus.length
        ) {
          onConfirmed()
        }
      }
    })
  })
  return <Pending {...props} />
}

function PendingTx(props) {
  const { txHash, txHashes, onConfirmed } = props
  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )
  const lastTransaction = last(transactionHistory)
  useEffect(() => {
    if (
      onConfirmed &&
      lastTransaction &&
      lastTransaction.txHash === txHash &&
      lastTransaction.txState === 'Confirmed'
    ) {
      onConfirmed({
        blockCreatedAt: lastTransaction.createdAt
      })
    }
  }, [transactionHistory])
  if (txHashes) {
    return <MultiplePendingTx txHashes={txHashes} onConfirmed={onConfirmed} />
  }
  return <Pending {...props} />
}

PendingTx.propTypes = {
  txHash: PropTypes.string,
  txHashes: PropTypes.array,
  onConfirmed: PropTypes.func
}

export default PendingTx

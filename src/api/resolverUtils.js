import { GET_TRANSACTION_HISTORY } from '../graphql/queries'
import client from '../apolloClient'

async function addTransaction({ txHash, txState }) {
  const newTransaction = {
    txHash,
    txState,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    __typename: 'Transaction'
  }

  const previous = client.readQuery({ query: GET_TRANSACTION_HISTORY })
  const index = previous.transactionHistory.findIndex(
    trx => trx.txHash === txHash
  )
  const newTransactionHistory = [...previous.transactionHistory]
  if (index >= 0) {
    newTransactionHistory[index] = {
      ...newTransactionHistory[index],
      txState,
      updatedAt: newTransaction.updatedAt
    }
  } else {
    newTransactionHistory.push(newTransaction)
  }

  const data = {
    transactionHistory: newTransactionHistory
  }
  client.writeQuery({ query: GET_TRANSACTION_HISTORY, data })
  return data
}

export function sendHelper(tx) {
  return new Promise((resolve, reject) => {
    tx()
      .on('transactionHash', txHash => {
        const txState = 'Pending'
        addTransaction({ txHash, txState })
        resolve(txHash)
      })
      .on('receipt', receipt => {
        const txHash = receipt.transactionHash
        const txState = 'Confirmed'
        addTransaction({ txHash, txState })
      })
  })
}

export async function estimateAndSend(tx, account) {
  let gas
  try {
    gas = await tx.estimateGas({ from: account })
  } catch (e) {
    console.log('gasEstimate error', { e, gas })
  }
  return () => tx.send({ from: account, gas })
}

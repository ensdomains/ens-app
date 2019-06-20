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

export async function sendHelper(txObj) {
  return new Promise(async (resolve, reject) => {
    resolve(txObj.hash)
    let txState = 'Pending'
    addTransaction({ txHash, txState })

    const receipt = await txObj.wait()
    const txHash = receipt.transactionHash
    txState = 'Confirmed'
    addTransaction({ txHash, txState })
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

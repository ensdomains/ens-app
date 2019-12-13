import { GET_TRANSACTION_HISTORY } from '../graphql/queries'
import getClient from '../apolloClient'

async function addTransaction({ txHash, txState }) {
  const client = getClient()
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
    addTransaction({ txHash: txObj.hash, txState })

    const receipt = await txObj.wait()
    const txHash = receipt.transactionHash
    txState = 'Confirmed'
    addTransaction({ txHash, txState })
  })
}

export async function sendHelperArray(arrayOfTxObj) {
  const promises = arrayOfTxObj.map(txObj => sendHelper(txObj))
  const values = await Promise.all(promises)
  return values
}

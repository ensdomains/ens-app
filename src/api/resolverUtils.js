import { GET_TRANSACTION_HISTORY } from '../graphql/queries'
import getClient from '../apolloClient'
import { getBlock, getTransaction } from '@ensdomains/ui'
async function addTransaction({ txHash, txState, blockNumber }) {
  const client = getClient()
  const newTransaction = {
    txHash,
    blockNumber,
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
    console.log('***sendHelper1', {
      txObj,
      block: await getBlock(),
      hash: await getTransaction(txObj.hash)
    })
    resolve(txObj.hash)
    let txState = 'Pending'
    console.log('***sendHelper2', {
      txObj,
      block: await getBlock(),
      hash: await getTransaction(txObj.hash)
    })
    addTransaction({ txHash: txObj.hash, txState })
    console.log('***sendHelper3', {
      txObj,
      block: await getBlock(),
      hash: await getTransaction(txObj.hash)
    })
    const receipt = await txObj.wait()
    console.log('***sendHelper4', {
      receipt,
      block: await getBlock(),
      hash: await getTransaction(txObj.hash)
    })

    const { transactionHash: txHash, blockNumber } = receipt.transactionHash
    console.log('***sendHelper5', {
      txHash,
      hash: await getTransaction(txObj.hash)
    })
    txState = 'Confirmed'
    addTransaction({ txHash, txState, blockNumber })
    console.log('***sendHelper6', {
      txHash,
      txState,
      hash: await getTransaction(txObj.hash)
    })
  })
}

export async function sendHelperArray(arrayOfTxObj) {
  const promises = arrayOfTxObj.map(txObj => sendHelper(txObj))
  const values = await Promise.all(promises)
  return values
}

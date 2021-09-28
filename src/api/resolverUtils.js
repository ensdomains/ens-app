import { transactionHistoryReactive } from '../apollo/reactiveVars'

async function addTransaction({ txHash, txState }) {
  const newTransaction = {
    txHash,
    txState,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    __typename: 'Transaction'
  }

  const previous = transactionHistoryReactive()
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
  transactionHistoryReactive(data)
  return data
}

export async function sendHelper(txObj) {
  return new Promise(async resolve => {
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

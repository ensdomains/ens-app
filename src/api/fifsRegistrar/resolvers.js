import { getAccounts } from '../web3'
import { getFifsRegistrarContract } from '../ens'
import { watchRegistryEvent } from '../watchers'
import gql from 'graphql-tag'

const defaults = {}

const resolvers = {
  Mutation: {
    registerTestDomain: async (object, { name }, { cache }) => {
      try {
        const { registrar, web3 } = await getFifsRegistrarContract()
        const accounts = await getAccounts()
        // const canRegister =
        //   new Date() <
        //   new Date(registrar.expiryTimes(web3.sha3(name)).toNumber() * 1000)
        console.log(accounts, registrar, web3)
        console.log(name)

        const txId = await new Promise((resolve, reject) => {
          registrar.register(
            web3.sha3(name),
            accounts[0],
            {
              from: accounts[0]
            },
            (error, txId) => {
              if (true) {
                resolve(txId)
              } else {
                reject(error)
              }
            }
          )
        })

        console.log(txId)

        const query = gql`
          query getPendingTransactions {
            pendingTransactions @client {
              id
              createdAt
            }
          }
        `
        const { pendingTransactions } = cache.readQuery({ query })

        console.log(pendingTransactions)
        const data = {
          pendingTransactions: [
            ...pendingTransactions,
            {
              id: txId,
              createdAt: new Date().toString(),
              __typename: 'Transaction'
            }
          ]
        }

        cache.writeData({ data })

        watchRegistryEvent('NewOwner', name, (error, log, event) => {
          if (log.transactionHash === txId) {
            const { pendingTransactions } = cache.readQuery({ query })
            const { transactionHistory } = cache.readQuery({
              query: gql`
                query getTxHistory {
                  transactionHistory {
                    id
                    createdAt
                  }
                }
              `
            })
            const successfulTx = pendingTransactions.filter(
              tx => tx.id === log.transactionHash
            )
            const data = {
              pendingTransactions: pendingTransactions.filter(
                tx => tx.id !== log.transactionHash
              ),
              transactionHistory: [...transactionHistory, ...successfulTx]
            }
            cache.writeData({ data })
            event.stopWatching()
          }
        })

        return {
          id: txId,
          __typename: 'Transaction'
        }
      } catch (e) {
        console.error(e)
        return null
      }
    }
  }
}

export default resolvers

export { defaults }

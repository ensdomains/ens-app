// import getWeb3, { getAccounts } from '../web31'
// import { getFifsRegistrarContract } from '../ens'
// import gql from 'graphql-tag'

// const defaults = {}

// const resolvers = {
//   Mutation: {
//     registerTestDomain: async (object, { name }, { cache }) => {
//       try {
//         const { registrar } = await getFifsRegistrarContract()
//         const web3 = await getWeb3()
//         const accounts = await getAccounts()
//         // const canRegister =
//         //   new Date() <
//         //   new Date(registrar.expiryTimes(web3.sha3(name)).toNumber() * 1000)
//         console.log(accounts, registrar, web3)
//         console.log(name)

//         const txReceipt = await registrar
//           .register(web3.utils.sha3(name), accounts[0])
//           .send({
//             from: accounts[0]
//           })
//           .once('transactionHash', hash => {
//             const query = gql`
//               query getPendingTransactions {
//                 pendingTransactions @client {
//                   id
//                   createdAt
//                 }
//               }
//             `
//             const { pendingTransactions } = cache.readQuery({ query })

//             console.log(pendingTransactions)
//             const data = {
//               pendingTransactions: [
//                 ...pendingTransactions,
//                 {
//                   id: txId,
//                   createdAt: new Date().toString(),
//                   __typename: 'Transaction'
//                 }
//               ]
//             }

//             cache.writeData({ data })
//           })

//         const { pendingTransactions } = cache.readQuery({ query })
//         const { transactionHistory } = cache.readQuery({
//           query: gql`
//             query getTxHistory {
//               transactionHistory {
//                 id
//                 createdAt
//               }
//             }
//           `
//         })
//         const successfulTx = pendingTransactions.filter(
//           tx => tx.id === log.transactionHash
//         )
//         const data = {
//           pendingTransactions: pendingTransactions.filter(
//             tx => tx.id !== log.transactionHash
//           ),
//           transactionHistory: [...transactionHistory, ...successfulTx]
//         }
//         cache.writeData({ data })
//         return {
//           id: txId,
//           transactionReceipt,
//           __typename: 'Transaction'
//         }
//       } catch (e) {
//         console.error(e)
//         return null
//       }
//     }
//   }
// }

// export default resolvers

// export { defaults }

import React, { Fragment, Component } from 'react'
import { Query, Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'
import { GET_WEB3 } from '../graphql/localQueries'

const GET_PENDING_TRANSACTIONS = gql`
  query getPendingTransations {
    pendingTransactions @client {
      id
      createdAt
    }
  }
`

const GET_TRANSACTION_HISTORY = gql`
  query getTransactionHistory {
    transactionHistory @client {
      id
      createdAt
    }
  }
`

const REGISTER_DOMAIN = gql`
  mutation registerTestDomain($name: String!) {
    registerTestDomain(name: $name) @client {
      id
    }
  }
`

const RegisterSubdomain = ({ setTx }) => {
  let input

  return (
    <Mutation mutation={REGISTER_DOMAIN}>
      {registerTestDomain => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault()
              registerTestDomain({ variables: { name: input.value } }).then(
                txId => {
                  console.log(txId)
                }
              )
              input.value = ''
            }}
          >
            <input
              ref={node => {
                input = node
              }}
            />
            <button type="submit">Register subdomain</button>
          </form>
        </div>
      )}
    </Mutation>
  )
}

class TestRegistrar extends Component {
  state = {
    started: false
  }
  render() {
    return (
      <Fragment>
        <Query query={GET_WEB3} pollInterval={500}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading web3</div>
            const { web3, people } = data
            console.log(data)
            return (
              <Fragment>
                <div>
                  {web3.accounts.length > 0
                    ? `Your ETH address is ${web3.accounts[0]}`
                    : 'Unlock metamask!'}
                </div>
                <div>{console.log(people)}</div>
                <RegisterSubdomain />
              </Fragment>
            )
          }}
        </Query>
        <Query query={GET_PENDING_TRANSACTIONS}>
          {({ data, loading }) => {
            const { pendingTransactions } = data
            if (loading) return <div>Loading pending txs</div>
            console.log(data)
            return (
              <div>
                <h2>Pending Transactions</h2>
                {pendingTransactions.map(tx => (
                  <li tx={tx.id}>
                    <a href={`http://ropsten.etherscan.io/tx/${tx.id}`}>
                      {tx.id}
                    </a>
                  </li>
                ))}
              </div>
            )
          }}
        </Query>
        <Query query={GET_TRANSACTION_HISTORY}>
          {({ data, loading }) => {
            const { transactionHistory } = data
            if (loading) return <div>Loading pending txs</div>
            console.log(data)
            return (
              <div>
                <h2>Transaction History</h2>
                {transactionHistory.map(tx => (
                  <li key={tx.id}>
                    <a href={`http://ropsten.etherscan.io/tx/${tx.id}`}>
                      {tx.id}
                    </a>
                  </li>
                ))}
              </div>
            )
          }}
        </Query>
      </Fragment>
    )
  }
}

export default TestRegistrar

import React, { Fragment, Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import 'ethereum-ens'

const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
    }
    people @client {
      id
      name
      image
    }
  }
`

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

class App extends Component {
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
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to React</h1>
                </header>

                <div>
                  {web3.accounts.length > 0
                    ? `Your ETH address is ${web3.accounts[0]}`
                    : 'Unlock metamask!'}
                </div>
                <div>{console.log(people)}</div>
                <RegisterSubdomain />
              </div>
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

export default App

import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

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

class PendingTx extends React.Component {
  render() {
    const { txHash, onConfirmed } = this.props
    return (
      <Query query={GET_TRANSACTION_HISTORY}>
        {({ data: { transactionHistory } }) => {
          const lastTransaction = _.last(transactionHistory)
          if (
            lastTransaction &&
            lastTransaction.txHash === txHash &&
            lastTransaction.txState === 'Confirmed'
          ) {
            onConfirmed()
          }
          return <Pending {...this.props} />
        }}
      </Query>
    )
  }
}

PendingTx.propTypes = {
  txHash: PropTypes.string,
  onConfirmed: PropTypes.func
}

export default PendingTx

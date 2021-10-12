import React, { Component } from 'react'
import { Mutation } from '@apollo/client/react/components'
import PropTypes from 'prop-types'
import { BID, START_AND_BID } from '../../graphql/mutations'

const BidContainer = ({ domainState: { name, state } }) =>
  state === 'Auction' ? (
    <Mutation mutation={BID}>
      {bid => <BidForm bidHandler={bid} name={name} />}
    </Mutation>
  ) : (
    <Mutation mutation={START_AND_BID}>
      {startAndBid => <BidForm bidHandler={startAndBid} name={name} />}
    </Mutation>
  )

class BidForm extends Component {
  handleSubmit = (e, bid) => {
    e.preventDefault()
    console.log(
      this.props.name,
      this.bidAmount.value,
      this.decoyBidAmount.value,
      this.secret.value
    )
    bid({
      variables: {
        name: this.props.name,
        bidAmount: this.bidAmount.value,
        decoyBidAmount: this.decoyBidAmount.value,
        secret: this.secret.value
      }
    })
  }
  render() {
    return (
      <div>
        Bid now!
        <form onSubmit={e => this.handleSubmit(e, this.props.bidHandler)}>
          <label name="bid-amount">Bid Amount</label>
          <input
            ref={bidAmount => (this.bidAmount = bidAmount)}
            type="number"
            name="bid-amount"
          />
          <label name="decoy-bid-amount">Bid Amount</label>
          <input
            ref={decoyBidAmount => (this.decoyBidAmount = decoyBidAmount)}
            type="number"
            name="decoy-bid-amount"
          />
          <label name="secret">Password</label>
          <input
            ref={secret => (this.secret = secret)}
            type="text"
            name="secret"
          />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

BidContainer.propTypes = {
  domainState: PropTypes.object // domain name
}

export default BidContainer

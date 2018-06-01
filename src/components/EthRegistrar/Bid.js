import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { BID } from '../../graphql/mutations'

class Bid extends Component {
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
        <Mutation mutation={BID}>
          {bid => (
            <form onSubmit={e => this.handleSubmit(e, bid)}>
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
          )}
        </Mutation>
      </div>
    )
  }
}

Bid.propTypes = {
  name: PropTypes.String
}

export default Bid

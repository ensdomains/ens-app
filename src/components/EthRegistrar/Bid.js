import React, { Component } from 'react'
import { Mutation } from 'react-apollo'

class Bid extends Component {
  onSubmit = e => {
    e.preventDefault()
    console.log(
      this.bidAmount.value,
      this.decoyBidAmount.value,
      this.password.value
    )
  }
  render() {
    return (
      <div>
        Bid now!
        <form onSubmit={this.onSubmit}>
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
          <label name="decoy-bid-amount">Password</label>
          <input
            ref={password => (this.password = password)}
            type="text"
            name="password"
          />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

export default Bid

export default class PremiumPriceOracle {
  constructor(expiryDate, algorithm) {
    if (algorithm === 'exponential') {
      this.startingPremiumInUsd = 100000000
    } else {
      // linear is the default
      this.releasedDate = expiryDate.clone().add(90, 'days')
      this.zeroPremiumDate = this.releasedDate.clone().add(28, 'days')
      this.startingPremiumInUsd = 100000
      this.diff = this.zeroPremiumDate.diff(this.releasedDate)
      this.rate = this.startingPremiumInUsd / this.diff
    }
  }

  getTargetAmountByDate(date) {
    return this.zeroPremiumDate.diff(date) * this.rate
  }
  getTargetDateByAmount(amount) {
    return this.zeroPremiumDate
      .clone()
      .subtract(amount / this.rate / 1000, 'second')
  }
}

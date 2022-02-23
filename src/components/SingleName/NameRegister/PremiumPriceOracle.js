const DAY = 60 * 60 * 24

export default class PremiumPriceOracle {
  constructor(expiryDate, algorithm) {
    if (algorithm === 'exponential') {
      this.startingPremiumInUsd = 100000000
      this.duration = 21
    } else {
      // linear is the default
      this.startingPremiumInUsd = 100000
      this.duration = 28
    }
    this.releasedDate = expiryDate.clone().add(90, 'days')
    this.zeroPremiumDate = this.releasedDate.clone().add(this.duration, 'days')
    this.diff = this.zeroPremiumDate.diff(this.releasedDate)
    this.rate = this.startingPremiumInUsd / this.diff
  }

  getDaysPast(currentDate) {
    return parseInt(currentDate.diff(this.releasedDate) / DAY / 1000)
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

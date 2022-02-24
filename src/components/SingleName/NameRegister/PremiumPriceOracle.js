const DAY = 60 * 60 * 24
const FACTOR = 0.5
export default class PremiumPriceOracle {
  constructor(expiryDate, algorithm) {
    this.algorithm = algorithm
    if (algorithm === 'exponential') {
      this.startingPremiumInUsd = 100000000
      this.totalDays = 21
    } else {
      // linear is the default
      this.startingPremiumInUsd = 100000
      this.totalDays = 28
    }
    this.releasedDate = expiryDate.clone().add(90, 'days')
    this.zeroPremiumDate = this.releasedDate.clone().add(this.totalDays, 'days')
    this.diff = this.zeroPremiumDate.diff(this.releasedDate)
    this.rate = this.startingPremiumInUsd / this.diff
    this.diffInHour = this.zeroPremiumDate.diff(this.releasedDate, 'hour')
    this.hourlyRate = this.startingPremiumInUsd / this.diffInHour
  }

  getDaysPast(currentDate) {
    return parseInt(currentDate.diff(this.releasedDate) / DAY / 1000)
  }

  getTargetDateByAmount(amount) {
    if (this.algorithm === 'exponential') {
      const daysPast =
        Math.log(amount / this.startingPremiumInUsd) / Math.log(FACTOR)
      const r = this.releasedDate.clone().add(daysPast * 24 * 60, 'minutes')
      return r
    } else {
      return this.zeroPremiumDate
        .clone()
        .subtract(amount / this.rate / 1000, 'second')
    }
  }

  getTargetAmountByDaysPast(daysPast) {
    if (this.algorithm === 'exponential') {
      const lastValue = this.startingPremiumInUsd * FACTOR ** this.totalDays
      const premium = this.startingPremiumInUsd * FACTOR ** daysPast
      console.log({ lastValue })
      if (premium >= lastValue) {
        return premium - lastValue
      } else {
        return 0
      }
    } else {
      return (this.totalDays - daysPast) * (this.hourlyRate * 24)
    }
  }

  exponentialReduceFloatingPoint(daysPast) {
    const lastPremium = this.startingPremiumInUsd * 0.5 ** this.totalDays
    const premium = this.startingPremiumInUsd * 0.5 ** daysPast
    if (premium >= lastPremium) {
      // return premium
      return premium - lastPremium
    }
    return 0
  }
}

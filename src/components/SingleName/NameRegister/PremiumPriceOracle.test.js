const moment = require('moment')
const PremiumPriceOracle = require('./PremiumPriceOracle').default
const ONE_HUNDRED = 100000
const ONE_HUNDRED_MILLION = 100000000

const configs = [
  {
    name: 'exponential',
    totalDays: 21,
    startingPremium: ONE_HUNDRED_MILLION
  },
  {
    name: 'linear',
    totalDays: 28,
    startingPremium: ONE_HUNDRED
  }
]

for (let i = 0; i < configs.length; i++) {
  const c = configs[i]
  describe(`${c.name} price oracle`, () => {
    let expiryDate, oracle
    beforeEach(function() {
      expiryDate = moment()
      oracle = new PremiumPriceOracle(expiryDate, c.name)
    })

    it('should set initial price and duration at initialisation', () => {
      expect(oracle.totalDays).toEqual(c.totalDays)
      expect(oracle.startingPremiumInUsd).toEqual(c.startingPremium)
    })

    describe('getTargetAmountByDaysPast', () => {
      if (c.name === 'exponential') {
        it('should show startingPremium - last value on day 0', () => {
          const LAST_VALUE = ONE_HUNDRED_MILLION * 0.5 ** 21
          expect(oracle.getTargetAmountByDaysPast(0)).toEqual(
            ONE_HUNDRED_MILLION - LAST_VALUE
          )
        })
      } else {
        it('should show starting price on day 0', () => {
          expect(Math.ceil(oracle.getTargetAmountByDaysPast(0))).toEqual(
            c.startingPremium
          )
        })
      }
      it('should show 0 on the last day', () => {
        expect(oracle.getTargetAmountByDaysPast(c.totalDays)).toEqual(0)
      })
    })

    describe('getTargetDateByAmount', () => {
      it('should show the release date on startingPremium', () => {
        const diff = oracle
          .getTargetDateByAmount(c.startingPremium)
          .diff(expiryDate.clone().add(90, 'days'), 'second')
        expect(diff).toEqual(0)
      })

      it('should show zero premium date on 0', () => {
        expect(oracle.getTargetDateByAmount(0)).toEqual(
          expiryDate.clone().add(90 + c.totalDays, 'days')
        )
      })
    })

    describe('getTargetAmountByDaysPast and getTargetDateByAmount', () => {
      for (let index = 0; index <= c.totalDays; index++) {
        it(`day ${index} should be the same`, () => {
          const now = expiryDate.clone().add(90 + index, 'days')
          const amount = oracle.getTargetAmountByDaysPast(index)
          const date = oracle.getTargetDateByAmount(amount)
          expect(date).toEqual(now)
        })
      }
    })
  })
}

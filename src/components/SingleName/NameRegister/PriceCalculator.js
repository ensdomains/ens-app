import EthVal from 'ethval'
export default class PremiumPriceCalculator {
  constructor({
    price, // in ETH, BN
    premium, // in ETH
    ethUsdPrice
  }) {
    // priceInEth = basePriceInUsd + premiumPriceInUsd = priceInUsd
    this.price = new EthVal(`${price}`).toEth()
    this.premium = new EthVal(`${premium}`).toEth()
    this.ethUsdPrice = ethUsdPrice
    this.priceInUsd = this.price.mul(ethUsdPrice)
    this.premiumInUsd = this.premium.mul(ethUsdPrice)
    this.basePriceInUsd = this.price.sub(this.premium).mul(ethUsdPrice)
  }

  toDisplay() {
    const {
      price,
      premium,
      ethUsdPrice,
      priceInUsd,
      premiumInUsd,
      basePriceInUsd
    } = this
    return {
      price: price.toFixed(2),
      premium: premium.toFixed(2),
      ethUsdPrice,
      priceInUsd: priceInUsd.toFixed(2),
      premiumInUsd: premiumInUsd.toFixed(2),
      basePriceInUsd: basePriceInUsd.toFixed(0)
    }
  }
}

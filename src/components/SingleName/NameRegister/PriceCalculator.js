import EthVal from 'ethval'
function priceCalculator({
  price, // in ETH, BN
  premium = 0, // in ETH
  ethUsdPrice
}) {
  if (!price) return {}
  const priceInEth = new EthVal(`${price}`).toEth()
  const premiumInEth = new EthVal(`${premium}`).toEth()
  let priceInUsd, premiumInUsd, basePriceInUsd
  if (ethUsdPrice) {
    priceInUsd = priceInEth.mul(ethUsdPrice).toFixed(2)
    premiumInUsd = premiumInEth.mul(ethUsdPrice).toFixed(2)
    basePriceInUsd = priceInEth
      .sub(premiumInEth)
      .mul(ethUsdPrice)
      .toFixed(0)
  }
  return {
    price: priceInEth.toFixed(3),
    premium: premiumInEth.toFixed(3),
    ethUsdPrice,
    priceInUsd,
    premiumInUsd,
    basePriceInUsd
  }
}
export default priceCalculator

import EthVal from 'ethval'
function priceCalculator({
  price, // in ETH, BN
  premium = 0, // in ETH
  ethUsdPrice
}) {
  const priceInEth = new EthVal(`${price}`).toEth()
  const premiumInEth = new EthVal(`${premium}`).toEth()
  return {
    price: priceInEth.toFixed(3),
    premium: premiumInEth.toFixed(3),
    ethUsdPrice,
    priceInUsd: priceInEth.mul(ethUsdPrice).toFixed(2),
    premiumInUsd: premiumInEth.mul(ethUsdPrice).toFixed(2),
    basePriceInUsd: priceInEth
      .sub(premiumInEth)
      .mul(ethUsdPrice)
      .toFixed(0)
  }
}
export default priceCalculator

import EthVal from 'ethval'
function priceCalculator({
  price, // in ETH, BN
  premium, // in ETH
  ethUsdPrice
}) {
  const priceInEth = new EthVal(`${price}`).toEth()
  const premiumInEth = new EthVal(`${premium}`).toEth()
  return {
    price: priceInEth.toFixed(2),
    premium: premiumInEth.toFixed(2),
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

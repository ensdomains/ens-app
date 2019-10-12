const coinInfo = {
  BTC: {
    index: 0,
    symbol: 'BTC',
    base: 58
  },
  LTC: {
    index: 0,
    symbol: 'LTC',
    base: 58
  },
  ETH: {
    index: 60,
    symbol: 'ETH',
    base: 16
  },
  ETC: {
    index: 61,
    symbol: 'ETC',
    base: 16
  }
}

export const coinList = Object.keys(coinInfo)

export default coinInfo

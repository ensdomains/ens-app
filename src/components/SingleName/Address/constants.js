const COIN_INFO = {
  BTC: {
    index: 0,
    symbol: 'BTC',
    base: 58,
    name: 'Bitcoin'
  },
  LTC: {
    index: 0,
    symbol: 'LTC',
    base: 58,
    name: 'Litecoin'
  },
  ETH: {
    index: 60,
    symbol: 'ETH',
    base: 16,
    name: 'Ethereum'
  },
  ETC: {
    index: 61,
    symbol: 'ETC',
    base: 16,
    name: 'Ethereum Classic'
  }
}

export const COIN_LIST = Object.keys(COIN_INFO)

export default COIN_INFO

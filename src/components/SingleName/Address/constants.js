const COIN_INFO = {
  BTC: {
    index: 0,
    symbol: 'BTC',
    base: 58,
    name: 'Bitcoin',
    encoding: 'base58check'
  },
  LTC: {
    index: 2,
    symbol: 'LTC',
    base: 58,
    name: 'Litecoin',
    encoding: 'base58check'
  },
  ETH: {
    index: 60,
    symbol: 'ETH',
    base: 16,
    name: 'Ethereum',
    encoding: 'hex-checksum'
  },
  ETC: {
    index: 61,
    symbol: 'ETC',
    base: 16,
    name: 'Ethereum Classic',
    encoding: 'hex-checksum'
  },
  RSK: {
    index: 137,
    symbol: 'RBTC',
    base: 16,
    name: 'Rootstock',
    encoding: 'hex-checksum'
  },
  MONA: {
    index: 22,
    symbol: 'MONA',
    base: 58,
    name: 'MonaCoin',
    encoding: 'base58check'
  },
  BNB: {
    index: 714,
    symbol: 'BNB',
    base: 32,
    name: 'Binance Coin',
    encoding: 'bech32'
  },
  DOGE: {
    index: 3,
    symbol: 'DOGE'
  },
  BCH: {
    index: 145,
    symbol: 'BCH'
  },
  XRP: {
    index: 144,
    symbol: 'XRP'
  }
}

export const COIN_LIST = Object.keys(COIN_INFO)

export default COIN_INFO

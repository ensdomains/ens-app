jest.mock('@ensdomains/ui', () => ({
  ethers: {
    providers: {
      JsonRpcProvider: jest.fn()
    },
    Contract: jest.fn()
  },
  getNetworkProviderUrl: jest.fn()
}))

import { ethers } from '@ensdomains/ui'
import validateTokenURI from './avatar'

describe('check avatar field', () => {
  const warn = console.warn

  beforeEach(() => {
    console.warn = jest.fn()
  })

  afterAll(() => {
    console.warn = warn
    jest.resetAllMocks()
  })

  test('should return true if given erc721 nft uri is valid', async () => {
    ethers.Contract.mockImplementation(() => ({
      tokenURI: () => 'https://api.bastardganpunks.club/9421'
    }))
    const nftURI =
      'eip155:1/erc721:0x31385d3520bced94f77aae104b406994d8f2168c/9421'
    const isValid = await validateTokenURI(nftURI)
    expect(isValid).toBe(true)
  })

  test('should return false if given erc721 nft uri is not valid (tokenID missing)', async () => {
    const nftURI = 'eip155:1/erc721:0x31385d3520bced94f77aae104b406994d8f2168c/'
    const isValid = await validateTokenURI(nftURI)
    expect(isValid).toBe(false)
    expect(console.warn).toHaveBeenCalledWith(
      new Error(
        'tokenID not found - eip155:1/erc721:0x31385d3520bced94f77aae104b406994d8f2168c/'
      )
    )
  })

  test('should return false if given erc721 nft uri is not valid (chainID missing)', async () => {
    const nftURI =
      'eip155/erc721:0x31385d3520bced94f77aae104b406994d8f2168c/9421'
    const isValid = await validateTokenURI(nftURI)
    expect(isValid).toBe(false)
    expect(console.warn).toHaveBeenCalledWith(
      new Error(
        'chainID not found - eip155/erc721:0x31385d3520bced94f77aae104b406994d8f2168c/9421'
      )
    )
  })

  test('should return false if given nft uri is not valid (unsupported namespace)', async () => {
    const nftURI =
      'eip155:1/erc725:0x31385d3520bced94f77aae104b406994d8f2168c/9421'
    const isValid = await validateTokenURI(nftURI)
    expect(isValid).toBe(false)
  })

  test('should return true if given erc1155 nft metadata uri is valid', async () => {
    ethers.Contract.mockImplementation(() => ({
      uri: () =>
        'https://api.opensea.io/api/v1/metadata/0x495f947276749Ce646f68AC8c248420045cb7b5e/0x{id}'
    }))
    const nftURI =
      'eip155:1/erc1155:0x495f947276749ce646f68ac8c248420045cb7b5e/8112316025873927737505937898915153732580103913704334048512380490797008551937'
    const isValid = await validateTokenURI(nftURI)
    expect(isValid).toBe(true)
  })

  test('should return false if given erc1155 nft metadata uri is missing', async () => {
    ethers.Contract.mockImplementation(() => ({
      uri: () => ''
    }))
    const nftURI =
      'eip155:1/erc1155:0x31385d3520bced94f77aae104b406994d8f2168c/9421'
    const isValid = await validateTokenURI(nftURI)
    expect(isValid).toBe(false)
  })
})

import { formatsByName } from '@ensdomains/address-encoder'

describe('address-encoder integration', () => {
  it('encoder', () => {
    const text = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    const hex = '76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac'
    const format = formatsByName['BTC']
    expect(format.encoder(new Buffer(hex, 'hex'))).toEqual(text)
  })

  it('decoder', () => {
    const text = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    const hex = '76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac'
    const format = formatsByName['BTC']
    expect(format.decoder(text).toString('hex')).toEqual(hex)
  })
})

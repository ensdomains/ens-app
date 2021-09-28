import React from 'react'
import { render } from '@testing-library/react'

jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

import EtherScanLink from './EtherScanLink'
import { StaticRouter } from 'react-router-dom'

describe('EtherScanLink', () => {
  it('should detect mainnet in a case insensitive manor', () => {
    useQuery.mockImplementation(() => ({ data: { network: 'Main' } }))

    const mockProps = {
      address: '0xaddr1',
      className: ''
    }

    const context = {}
    const { getByTestId } = render(
      <StaticRouter location={'/'} context={context}>
        <EtherScanLink {...mockProps} />
      </StaticRouter>
    )

    expect(getByTestId('ether-scan-link-container').href).toBe(
      'https://etherscan.io/address/0xaddr1'
    )
  })

  it('should add network to link if on a network other than mainnet', () => {
    useQuery.mockImplementation(() => ({ data: { network: 'ropsten' } }))

    const mockProps = {
      address: '0xaddr1',
      className: ''
    }

    const context = {}
    const { getByTestId } = render(
      <StaticRouter location={'/'} context={context}>
        <EtherScanLink {...mockProps} />
      </StaticRouter>
    )

    expect(getByTestId('ether-scan-link-container').href).toBe(
      'https://ropsten.etherscan.io/address/0xaddr1'
    )
  })
})

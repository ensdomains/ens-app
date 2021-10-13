import { getQueryName } from '../../utils/graphql'

jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn()
}))
import { useTranslation } from 'react-i18next'

jest.mock('../Blockies', () => ({
  __esModule: true,
  ...jest.requireActual('../Blockies'),
  default: jest.fn()
}))
import UnstyledBlockies from '../Blockies'

import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import NetworkInformation from './NetworkInformation'

describe('NetworkInformation', () => {
  it('should not make a request to get reverse record until account data is available', () => {
    useTranslation.mockImplementation(() => ({ t: () => null }))
    let isSkipped = false

    const getNetworkInfoResponse = {
      accounts: [],
      isSafeApp: false,
      network: 1,
      displayName: 'displayName',
      isReadOnly: false
    }

    useQuery.mockImplementation((query, options) => {
      const operationName = getQueryName(query)

      switch (operationName) {
        case 'getNetworkInfo':
          return {
            refetch: () => null,
            data: getNetworkInfoResponse
          }
        case 'getReverseRecord':
          isSkipped = options.skip
          return {
            refetch: () => null,
            data: {
              getReverseRecord: 'vitalik.eth '
            }
          }
        default:
          return {
            refetch: () => null,
            data: {}
          }
      }

      return {}
    })

    UnstyledBlockies.mockImplementation(() => <div />)

    const { rerender } = render(
      <MockedProvider addTypename={false}>
        <NetworkInformation />
      </MockedProvider>
    )
    expect(isSkipped).toBeTruthy()

    getNetworkInfoResponse.accounts = ['0xAddress']

    rerender(
      <MockedProvider addTypename={false}>
        <NetworkInformation />
      </MockedProvider>
    )

    expect(isSkipped).toBeFalsy()
  })
})

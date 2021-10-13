import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

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

jest.mock('./hooks', () => ({
  useEditable: jest.fn()
}))
import { useEditable } from './hooks'

import AddReverseRecord from './AddReverseRecord'
import { getQueryName } from '../utils/graphql'

describe('getReverseRecord', () => {
  it('should not lookup reverse record information if there is no address', async () => {
    const props = {
      account: '0xAccount',
      currentAddress: null
    }
    useTranslation.mockImplementation(() => ({ t: () => null }))
    useEditable.mockImplementation(() => ({
      state: {
        editing: null,
        txHash: null,
        pending: null,
        confirmed: null
      },
      actions: {
        startEditing: () => null,
        stopEditing: () => null,
        startPending: () => null,
        setConfirmed: () => null
      }
    }))
    let isSkipped = false
    useQuery.mockImplementation((query, options) => {
      const operationName = getQueryName(query)

      switch (operationName) {
        case 'getReverseRecord':
          isSkipped = options.skip
          return {
            refetch: () => null,
            data: {
              getReverseRecord: 'vitalik.eth '
            }
          }
        case 'getNamesFromSubgraph':
          return {
            refetch: () => null,
            data: {}
          }
        default:
          return {
            refetch: () => null,
            data: {}
          }
      }

      return {}
    })

    const { rerender } = render(
      <MockedProvider addTypename={false}>
        <AddReverseRecord {...props} />
      </MockedProvider>
    )
    expect(isSkipped).toBeTruthy()

    props.currentAddress = '0xCurrentAddress'
    rerender(
      <MockedProvider addTypename={false}>
        <AddReverseRecord {...props} />
      </MockedProvider>
    )

    expect(isSkipped).toBeFalsy()
  })
})

import { renderHook } from '@testing-library/react-hooks'
import { useTotalPages } from './Pager'

jest.mock('../../apollo/apolloClient', () => ({
  __esModule: true,
  default: jest.fn()
}))
import getClient from '../../apollo/apolloClient'

import {
  GET_FAVOURITES,
  GET_DOMAINS_SUBGRAPH,
  GET_REGISTRATIONS_SUBGRAPH
} from '../../graphql/queries'

describe('useTotalPages', () => {
  afterEach(() => {
    getClient.mockClear()
  })
  it('should return 0 if called with unsupported query', () => {
    const { result } = renderHook(() =>
      useTotalPages({
        resultsPerPage: 20,
        query: GET_FAVOURITES,
        variables: {}
      })
    )
    expect(result.current).toEqual({ totalPages: 0, loading: false })
  })
  it('should work with registrations', async () => {
    getClient.mockImplementation(() => ({
      query: () => ({
        data: {
          account: {
            registrations: [0, 1, 2]
          }
        }
      })
    }))

    const { result, waitForNextUpdate } = renderHook(() =>
      useTotalPages({
        resultsPerPage: 20,
        query: GET_REGISTRATIONS_SUBGRAPH,
        variables: {}
      })
    )

    await waitForNextUpdate()

    expect(result.current).toEqual({ totalPages: 1, loading: false })
  })
  it('should work with domains', async () => {
    getClient.mockImplementation(() => ({
      query: () => ({
        data: {
          account: {
            domains: [0, 1, 2]
          }
        }
      })
    }))

    const { result, waitForNextUpdate } = renderHook(() =>
      useTotalPages({
        resultsPerPage: 20,
        query: GET_DOMAINS_SUBGRAPH,
        variables: {}
      })
    )

    await waitForNextUpdate()

    expect(result.current).toEqual({ totalPages: 1, loading: false })
  })
})

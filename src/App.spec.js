import React from 'react'
import { render } from '@testing-library/react'

jest.mock('./hooks/useReactiveVarListeners', () => ({
  __esModule: true,
  default: jest.fn()
}))
import useReactiveVarListeners from './hooks/useReactiveVarListeners'

jest.mock('./utils/analytics', () => ({
  setupAnalytics: jest.fn()
}))
import { setup } from './utils/analytics'

jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

import App from './App'
import { StaticRouter } from 'react-router-dom'

describe('App', () => {
  it('should render network error when one exists', () => {
    const context = {}
    useReactiveVarListeners.mockImplementation(() => null)
    useQuery.mockImplementation(() => ({
      data: { globalError: { network: 'error' } }
    }))

    const { getByTestId } = render(
      <StaticRouter location={'/'} context={context}>
        <App />
      </StaticRouter>
    )
    expect(getByTestId('network-error')).toBeTruthy()
  })
})

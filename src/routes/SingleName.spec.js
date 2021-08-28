jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

jest.mock('../components/hooks', () => ({
  useScrollTo: jest.fn()
}))
import { useScrollTo } from '../components/hooks'

import { render } from '@testing-library/react'
import { StaticRouter } from 'react-router-dom'
import SingleName from './SingleName'

describe('SingeName', () => {
  it('should render without error if default data is returned from GET_SINGLE_NAME', () => {
    useQuery.mockImplementation(() => ({ data: { isENSReady: false } }))

    const mockProps = {
      match: {
        params: { name: 'searchTerm' }
      },
      location: {
        pathname: 'pathname'
      }
    }

    const context = {}
    render(
      <StaticRouter location={'/'} context={context}>
        <SingleName {...mockProps} />
      </StaticRouter>
    )

    expect(true)
  })
})

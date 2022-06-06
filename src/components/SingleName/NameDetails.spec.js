import react from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { StaticRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

jest.mock('./DetailsContainer', () => ({
  __esModule: true,
  ...jest.requireActual('./DetailsContainer'),
  default: jest.fn()
}))
import DetailsContainer from './DetailsContainer'

import NameDetails from './NameDetails'

const mocks = []

describe('NameDetails', () => {
  const pathnameroot = '/name/vitalik.eth'
  afterEach(() => {
    useQuery.mockClear()
  })
  it('should redirect to /register if register tab is register', () => {
    const mockProps = {
      domain: {
        name: 'vitalik.eth'
      },
      pathname: pathnameroot,
      tab: 'register'
    }

    useQuery.mockImplementation(() => ({
      data: {
        isMigrated: true
      },
      loading: true
    }))

    const context = { url: pathnameroot }
    render(
      <StaticRouter location={'/'} context={context}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NameDetails {...mockProps} />
        </MockedProvider>
      </StaticRouter>
    )
    expect(context.url).toEqual(`${pathnameroot}/register`)
  })

  it('should redirect to /details if tab is not register', () => {
    const mockProps = {
      domain: {
        name: 'vitalik.eth'
      },
      pathname: pathnameroot + '/',
      tab: 'details'
    }

    useQuery.mockImplementation(() => ({
      data: {
        isMigrated: true
      },
      loading: true
    }))

    const context = { url: pathnameroot }
    render(
      <StaticRouter location={'/'} context={context}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NameDetails {...mockProps} />
        </MockedProvider>
      </StaticRouter>
    )
    expect(context.url).toEqual(`${pathnameroot}/details`)
  })
  const array = ['register', 'details', 'subdomains']
  for (let index = 0; index < array.length; index++) {
    const tab = array[index]
    it(`should not redirect to /${tab} if already in ${tab}`, () => {
      const mockProps = {
        domain: {
          name: 'vitalik.eth'
        },
        pathname: `${pathnameroot}/${tab}`,
        tab
      }

      useQuery.mockImplementation(() => ({
        data: {
          isMigrated: true
        },
        loading: true
      }))

      const context = { url: `${pathnameroot}/${tab}` }
      render(
        <StaticRouter location={'/'} context={context}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <NameDetails {...mockProps} />
          </MockedProvider>
        </StaticRouter>
      )
      expect(context.url).toEqual(`${pathnameroot}/${tab}`)
    })
  }

  it('should pass isMigrated loading state to DetailsContainer', () => {
    const mockProps = {
      domain: {
        name: 'vitalik.eth',
        parent: ''
      },
      pathname: '/name/leontalbert.eth/details',
      tab: 'details'
    }

    useQuery.mockImplementation(() => ({
      data: {
        isMigrated: true
      },
      loading: true
    }))

    let loadingIsMigrated
    DetailsContainer.mockImplementation(props => {
      loadingIsMigrated = props.loadingIsMigrated
      return <div />
    })

    const context = {}
    render(
      <StaticRouter
        location={'/name/leontalbert.eth/details'}
        context={context}
      >
        <NameDetails {...mockProps} />
      </StaticRouter>
    )

    expect(loadingIsMigrated).toBeTruthy()
  })
})

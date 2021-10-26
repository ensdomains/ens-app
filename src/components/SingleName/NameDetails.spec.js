import react from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { StaticRouter } from 'react-router-dom'

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
  afterEach(() => {
    useQuery.mockClear()
  })
  it('should redirect to /register if register tab and is not an absolute path', () => {
    const mockProps = {
      domain: {
        name: 'vitalik.eth',
        parent: 'eth'
      },
      pathname: '',
      tab: 'register'
    }

    useQuery.mockImplementation(() => ({
      data: {
        isMigrated: true
      },
      loading: true
    }))

    const context = {}
    render(
      <StaticRouter location={'/'} context={context}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NameDetails {...mockProps} />
        </MockedProvider>
      </StaticRouter>
    )
    expect(context.url).toEqual('/register')
  })
  it('should redirect to /details if details tab and is not an absolute path', () => {
    const mockProps = {
      domain: {
        name: 'vitalik.eth',
        parent: 'eth'
      },
      pathname: '',
      tab: 'details'
    }

    useQuery.mockImplementation(() => ({
      data: {
        isMigrated: true
      },
      loading: true
    }))

    const context = {}
    render(
      <StaticRouter location={'/'} context={context}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NameDetails {...mockProps} />
        </MockedProvider>
      </StaticRouter>
    )
    expect(context.url).toEqual('/details')
  })
  it('should redirect to /subdomains if subdomains tab and is not an absolute path', () => {
    const mockProps = {
      domain: {
        name: 'sub.vitalik.eth',
        parent: 'vitalik'
      },
      pathname: '',
      tab: 'subdomains'
    }

    useQuery.mockImplementation(() => ({
      data: {
        isMigrated: true
      },
      loading: true
    }))

    const context = {}
    render(
      <StaticRouter location={'/'} context={context}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NameDetails {...mockProps} />
        </MockedProvider>
      </StaticRouter>
    )
    expect(context.url).toEqual('/subdomains')
  })
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

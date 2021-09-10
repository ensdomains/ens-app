import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { Router, StaticRouter } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import NameDetails from './NameDetails'

const mocks = []

describe('NameDetails', () => {
  it('should redirect to /register if register tab and is not an absolute path', () => {
    const mockProps = {
      domain: {
        name: 'vitalik.eth',
        parent: 'eth'
      },
      pathname: '',
      tab: 'register'
    }
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

  it('should show a warning/message that this name is wrapped IF wrapped', () => {})
  it.todo('should show owner field if name is wrapped')
  it.todo('should hide registrant if it is wrapped and is a .eth name')
  it.todo('should not allow user to transfer if that fuse is set')
  it.todo(
    'should not allow user to transfer if that fuse is not set and is a wrapped name'
  )
  it.todo('should hide transfer on reigstrant if is wrapped name')
})

describe('Details', () => {
  it.todo('should make space for name wrapper warning when name wrapper')
})

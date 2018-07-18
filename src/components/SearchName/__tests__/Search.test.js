import React from 'react'
import {
  render,
  renderIntoDocument,
  cleanup,
  Simulate
} from 'react-testing-library'

import { ApolloProvider } from 'react-apollo'
import createClient from '../../../testing-utils/mockedClient'

import SearchContainer, { parseSearchTerm } from '../Search'

afterEach(cleanup)

describe('parseSearchTerm', () => {
  it('returns "eth" when a full ens name is given', () => {
    expect(parseSearchTerm('something.eth')).toBe('eth')
  })

  it('returns "unsupported" when a name is in the list but not supported', () => {
    expect(parseSearchTerm('something.xyz')).toBe('unsupported')
  })

  it('returns "unsupported" when an unsupported domain is given', () => {
    expect(parseSearchTerm('something.x')).toBe('unsupported')
  })

  it('returns "unsupported" when an unsupported domain is given', () => {
    expect(parseSearchTerm('something.')).toBe('unsupported')
  })

  it('returns "nameSearch" when a partial ens name is given', () => {
    expect(parseSearchTerm('something')).toBe('search')
  })

  it('returns "address" when ethereum address is given', () => {
    expect(parseSearchTerm('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(
      'address'
    )
  })

  it('returns "inavlid" when a partial ens name is not a valid ENS name', () => {
    expect(parseSearchTerm('something&')).toBe('invalid')
  })
})

test('should call resolver without blowing up', () => {
  const getDomainAvailability = jest.fn()
  const resolverOverwrites = {
    Mutation: () => ({
      getDomainAvailability
    })
  }
  const { getByText, container } = renderIntoDocument(
    <ApolloProvider client={createClient(resolverOverwrites)}>
      <SearchContainer />
    </ApolloProvider>
  )

  const submitButton = getByText('Check Availability')
  const form = container.querySelector('form')
  const input = form.querySelector('input')
  input.value = 'vitalik.eth'
  Simulate.change(input)
  submitButton.click()
  expect(getDomainAvailability).toHaveBeenCalledTimes(1)
})

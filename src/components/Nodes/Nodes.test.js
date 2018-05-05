import React from 'react'
import { Nodes } from './Nodes'

import { render, cleanup } from 'react-testing-library'
import 'dom-testing-library/extend-expect'

afterEach(cleanup)

test('check Nodes renders', () => {
  const { getByText, container } = render(<Nodes />)
})

test('check Nodes renders items', () => {
  const nodes = [
    {
      name: 'vitalik.eth',
      owner: '0x123456789'
    }
  ]
  const { getByText, container } = render(<Nodes nodes={nodes} />)

  expect(getByText('vitalik.eth')).toHaveTextContent(
    'vitalik.eth - 0x123456789'
  )
})

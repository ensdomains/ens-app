import { resolveQueryPath } from '../resolvers'

test('test query path gives correct path', () => {
  const db = {
    nodes: [
      {
        label: 'vitalik',
        name: 'vitalik.eth',
        nodes: []
      }
    ]
  }
  expect(resolveQueryPath(['vitalik'], ['nodes'], db)).toEqual([
    'nodes',
    0,
    'nodes'
  ])
})

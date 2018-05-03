import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const getNodes = gql`
  query nodes {
    nodes {
      name
      owner
      label
      resolver
      addr
      content
      nodes
    }
  }
`

const Node = ({ node }) => (
  <div>
    {node.name} - {node.owner}
  </div>
)

const Nodes = () => (
  <Query query={getNodes}>
    {({ loading, error, data }) => (
      <div>{data.nodes.map(node => <Node node={node} />)}</div>
    )}
  </Query>
)

export default Nodes

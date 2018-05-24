import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { GET_SUBDOMAINS } from '../../graphql/mutations'
import { GET_NODES } from '../../graphql/queries'

const Node = ({ node: { owner, name, nodes = [] } }) => (
  <Mutation mutation={GET_SUBDOMAINS}>
    {getSubdomains => (
      <div>
        {name} - {owner}
        <button onClick={() => getSubdomains({ variables: { name } })}>
          Get subdomains
        </button>
        <ul>{nodes.map((node, i) => <Node key={i} node={node} />)}</ul>
      </div>
    )}
  </Mutation>
)

const Nodes = ({ nodes }) => (
  <div>{nodes.map((node, i) => <Node node={node} key={i} />)}</div>
)

const NodesContainer = () => (
  <Query query={GET_NODES}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>
      return <Nodes nodes={data.nodes} />
    }}
  </Query>
)

export default NodesContainer

export { Nodes }

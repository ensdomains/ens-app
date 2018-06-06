import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { SubDomainStateFields } from '../../graphql/fragments'

const GET_SUBDOMAIN_STATE = gql`
  query getSubDomainState {
    subDomainState {
      ...SubDomainStateFields
    }
  }

  ${SubDomainStateFields}
`

class SubDomainResults extends Component {
  render() {
    return (
      <Query query={GET_SUBDOMAIN_STATE}>
        {({ data: { subDomainState } }) =>
          subDomainState.map(node => {
            console.log(node)
            if (!node.available) {
              return (
                <li style={{ textDecoration: 'line-through' }}>
                  {node.label}.{node.domain}.eth
                </li>
              )
            }
            return (
              <li>
                {node.label}.{node.domain}.eth
              </li>
            )
          })
        }
      </Query>
    )
  }
}

export default SubDomainResults

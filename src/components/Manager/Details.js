import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { GET_SUBDOMAINS } from '../../graphql/queries'

const DetailsContainer = styled('div')`
  .sub-domains {
    a {
      display: block;
    }
  }
`

class Details extends Component {
  render() {
    const { details } = this.props
    const keys = Object.keys(details)
    return (
      <DetailsContainer>
        {keys.map((key, i) => {
          return (
            <div key={i}>
              {key} - {String(details[key])}
            </div>
          )
        })}
        <div className="sub-domains">
          <Query query={GET_SUBDOMAINS} variables={{ name: details.name }}>
            {({ loading, error, data }) => {
              if (loading) return <div>Loading...</div>
              console.log(data)
              return data.getSubDomains.subDomains.map(d => (
                <Link to={`/name/${d}`}>{d}</Link>
              ))
            }}
          </Query>
        </div>
      </DetailsContainer>
    )
  }
}

export default Details

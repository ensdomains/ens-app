import React, { Component } from 'react'
import { validateName, parseSearchTerm } from '../lib/utils'
import { GET_SINGLE_NAME } from '../graphql/queries'
import { Query } from 'react-apollo'
import Loader from '../components/Loader'

import Name from '../components/SingleName/Name'

class SingleName extends Component {
  state = {
    valid: false
  }
  checkValidity = () => {
    const searchTerm = this.props.match.params.name
    const validity = parseSearchTerm(searchTerm)
    const valid = validity === 'supported' || validity === 'tld'

    this.setState({ valid })
  }
  componentDidMount() {
    this.checkValidity()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.checkValidity()
    }
  }
  render() {
    const searchTerm = this.props.match.params.name
    if (this.state.valid) {
      return (
        <Query query={GET_SINGLE_NAME} variables={{ name: searchTerm }}>
          {({ loading, error, data }) => {
            if (loading) return <Loader large center />
            if (error)
              return <div>{(console.log(error), JSON.stringify(error))}</div>
            console.log(data)
            return (
              <div>
                <Name details={data.singleName} name={searchTerm} />
              </div>
            )
          }}
        </Query>
      )
    }

    return <div>Invalid domain name {searchTerm}</div>
  }
}

export default SingleName

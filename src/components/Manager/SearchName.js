import React, { Component } from 'react'

//import { updateSearchName, setNodeDetails, setNodeDetailsSubDomain } from '../updaters/nodes'
//import { addNotification } from '../updaters/notifications'
import { getOwner } from '../../api/registry'
import { compose, withApollo } from 'react-apollo'
import { withHandlers } from 'recompose'
import gql from 'graphql-tag'
import NotificationsContext from '../../Notifications'
import { GET_SUBDOMAINS } from '../../graphql/mutations'
import styled from 'react-emotion'

const addNode = gql`
  mutation addNode($name: String) {
    addNode(name: $name) @client {
      name
      owner
    }
  }
`

const SearchNameStyles = styled('div')`
  .search-name {
    background: blue;
  }
`

export function handleGetNodeDetails(name, client, addNotification) {
  if (name.split('.').length > 2) {
    getOwner(name).then(owner => {
      if (parseInt(owner, 16) === 0) {
        addNotification({ message: `${name} does not have an owner!` })
      } else {
        //Mutate state to setNodeDetailsSubdomain
        //setNodeDetailsSubDomain(name, owner)
      }
    })
  } else if (name.split('.').length === 0) {
    addNotification('Please enter a name first')
  } else if (name.split('.').length === 1) {
    addNotification({ message: 'Please add a TLD such as .eth' })
  } else {
    client
      .mutate({
        mutation: addNode,
        variables: { name }
      })
      .then(({ data: { addNode } }) => {
        if (addNode !== null) {
          addNotification({ message: `Node details set for ${name}` })
          client.mutate({
            mutation: GET_SUBDOMAINS,
            variables: { name }
          })
        } else {
          addNotification({
            message: `${name} does not have an owner!`
          })
        }
      })
  }
}

export class SearchName extends Component {
  state = {
    searchName: ''
  }

  updateSearchName = searchName =>
    this.setState({
      searchName
    })
  render() {
    const { handleGetNodeDetails, client } = this.props
    return (
      <SearchNameStyles>
        <NotificationsContext.Consumer>
          {({ addNotification }) => (
            <form
              className="search-name"
              onSubmit={event => {
                event.preventDefault()

                handleGetNodeDetails(
                  this.state.searchName,
                  client,
                  addNotification
                )
                this.setState({
                  searchName: ''
                })
              }}
            >
              <div className="search-box">
                <input
                  type="text"
                  id="address"
                  name="domain"
                  placeholder="vitalik.eth"
                  value={this.state.searchName}
                  onChange={e => this.updateSearchName(e.target.value)}
                />
              </div>
              <button className="get-details" type="submit">
                Search for domain
              </button>
            </form>
          )}
        </NotificationsContext.Consumer>
      </SearchNameStyles>
    )
  }
}

export default compose(
  withApollo,
  withHandlers({
    handleGetNodeDetails: props => (name, client, addNotification) =>
      handleGetNodeDetails(name, client, addNotification)
  })
)(SearchName)

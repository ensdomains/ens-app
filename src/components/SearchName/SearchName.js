import React, { Component } from 'react'
import classnames from 'classnames'

//import { updateSearchName, setNodeDetails, setNodeDetailsSubDomain } from '../updaters/nodes'
//import { addNotification } from '../updaters/notifications'
import { getOwner } from '../../api/registry'
import { compose } from 'react-apollo'
import { withHandlers } from 'recompose'

function addNotification(message) {
  console.log(message)
}

function handleGetNodeDetails(name) {
  if (name.split('.').length > 2) {
    getOwner(name).then(owner => {
      if (parseInt(owner, 16) === 0) {
        addNotification(`${name} does not have an owner!`)
      } else {
        //Mutate state to setNodeDetailsSubdomain
        //setNodeDetailsSubDomain(name, owner)
      }
    })
  } else if (name.split('.').length === 0) {
    addNotification('Please enter a name first')
  } else if (name.split('.').length === 1) {
    addNotification('Please add a TLD such as .eth')
  } else {
    getOwner(name).then(owner => {
      if (parseInt(owner, 16) === 0) {
        addNotification(`${name} does not have an owner!`)
      } else {
        //Mutate state to setNodeDetails
        //setNodeDetails(name)
        addNotification(`Node details set for ${name}`)
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
    const { handleGetNodeDetails } = this.props
    return (
      <form
        className="search-name"
        onSubmit={event => {
          event.preventDefault()
          handleGetNodeDetails(this.state.searchName)
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
    )
  }
}

export default compose(
  withHandlers({
    handleGetNodeDetails: props => name => handleGetNodeDetails(name)
  })
)(SearchName)

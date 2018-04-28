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

// export const SearchName = ({ handleGetNodeDetails, nameSearch }) => {
//   return <form className="search-name" onSubmit={(event) => { event.preventDefault(); handleGetNodeDetails(nameSearch) }}>
//     <div className="search-box">
//       <input type="text" id="address" placeholder="vitalik.eth" onChange={(e) => updateSearchName(e.target.value)} />
//     </div>
//     <button className="get-details">Get Details</button>
//   </form>
// }

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
            placeholder="vitalik.eth"
            value={this.state.searchName}
            onChange={e => this.updateSearchName(e.target.value)}
          />
        </div>
        <button className="get-details">Get Details</button>
      </form>
    )
  }
}

export default compose(
  withHandlers({
    handleGetNodeDetails: props => name => {
      //event.preventDefault()
      console.log()
      handleGetNodeDetails(name)
    }
  })
)(SearchName)

// export default connect(db => ({ nameSearch: db.get('nameSearch'), handleGetNodeDetails }))(SearchName)

import React, { createContext, Component } from 'react'

const filters = {
  searchDomains: ['top', 'sub'],
  unavailableNames: true,
  price: 'all'
}

const GlobalState = createContext({
  filters
})

export default GlobalState

export class GlobalStateProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filters,
      actions: {
        toggleUnavailableNames: this.toggleUnavailableNames,
        togglePriceFilter: this.togglePriceFilter,
        updateSearchDomains: this.updateSearchDomains
      }
    }
  }

  toggleUnavailableNames() {
    this.setState(state => ({
      unavailableNames: !state.unavailableNames
    }))
  }

  updateSearchDomains(list = filters.searchDomains) {
    this.setState(() => ({
      unavailableNames: list
    }))
  }

  togglePriceFilter() {
    this.setState(state => ({
      unavailableNames: state.price === 'all' ? 'free' : 'all'
    }))
  }

  render() {
    return (
      <GlobalState.Provider value={this.state}>
        {this.props.children}
      </GlobalState.Provider>
    )
  }
}

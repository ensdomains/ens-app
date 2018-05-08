import React, { Component } from 'react'
import { compose, withHandlers } from 'recompose'

const CheckAvailability = ({ searchDomain }) => {
  let domain
  return (
    <form onSubmit={e => searchDomain(domain, e)}>
      <input ref={el => (domain = el)} />
      <button type="submit">Check Availability</button>
    </form>
  )
}

export { CheckAvailability }

export default compose(
  withHandlers({
    searchDomain: props => (domain, event) => {
      event.preventDefault()
      console.log('searchDomain')
    }
  })
)(CheckAvailability)

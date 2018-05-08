import React, { Component } from 'react'
import { compose, withHandlers } from 'recompose'

// class CheckName extends Component {
//   render() {
//     return <div>
//       <input ref={el => this.inputElement = el}/>
//     </div>
//   }
// }

const CheckAvailability = ({ searchDomain }) => {
  let domain
  return (
    <form onSubmit={e => searchDomain(domain, e)}>
      <input ref={el => (domain = el)} />
      <input type="submit" value="Check Availability" />
    </form>
  )
}

export default compose(
  withHandlers({
    searchDomain: props => (domain, event) => {
      event.preventDefault()
    }
  })
)(CheckAvailability)

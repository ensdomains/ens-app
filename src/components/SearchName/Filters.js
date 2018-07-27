import React, { Component } from 'react'
import styled from 'react-emotion'

const FiltersContainer = styled('div')`
  display: ${props => (props.show ? 'block' : 'none')};
  background: white;
  border-radius: 10px;
  width: 300px;
  position: absolute;
  top: 100%;
  right: 162px;
  margin-top: 10px;
`

const H3 = styled('h3')`
  text-transform: uppercase;
  color: #b7c5d7;
  font-size: 14px;
  font-weight: 500;
`

class Filters extends Component {
  render() {
    return (
      <FiltersContainer show={this.props.show}>
        <H3>Search Domains</H3>
        <H3>Extensions</H3>
        <H3>Unavailable Names</H3>
        <H3>Price</H3>
        <H3>Search Owner</H3>
      </FiltersContainer>
    )
  }
}

export default Filters

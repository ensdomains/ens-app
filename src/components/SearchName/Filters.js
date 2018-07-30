import React, { Component } from 'react'
import styled from 'react-emotion'
import Tick from './Tick'

const FiltersContainer = styled('div')`
  transform-origin: top right;
  transform: ${props =>
    props.show ? 'scale(1) translate(0,0)' : 'scale(0.5) translate(0,-50px)'};
  opacity: ${props => (props.show ? '1' : '0')};
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
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
        <Tick />
        <Tick />
        <H3>Extensions</H3>
        <H3>Unavailable Names</H3>
        <H3>Price</H3>
        <H3>Search Owner</H3>
      </FiltersContainer>
    )
  }
}

export default Filters

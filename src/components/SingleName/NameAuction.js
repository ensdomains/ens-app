import React, { Component } from 'react'
import styled from 'react-emotion'

const NameAuctionContainer = styled('div')``

class NameAuction extends Component {
  render() {
    const { details } = this.props
    return <NameAuctionContainer>{'name auction'}</NameAuctionContainer>
  }
}

export default NameAuction

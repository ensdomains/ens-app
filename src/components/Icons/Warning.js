import React, { Component } from 'react'
import styled from '@emotion/styled/macro'

class Warning extends Component {
  render() {
    return (
      <WarningContainer width="19" height="17" className={this.props.className}>
        <path
          d="M8.746 5.03c.47-.115.96.114 1.156.554.059.153.098.307.098.479-.02.478-.059.976-.098 1.454-.04.746-.098 1.512-.137 2.258-.02.249-.02.268-.02.517A.732.732 0 0 1 9 11c-.411 0-.725-.287-.744-.689-.06-1.167-.137-2.143-.196-3.31L8 6.062c-.019-.479.275-.9.746-1.034M9.01 14A1.01 1.01 0 0 1 8 13c0-.549.455-1 1.01-1 .554 0 1.01.451.99 1.02.02.529-.456.98-.99.98m-6.161 3h13.293c2.188 0 3.563-2.361 2.48-4.209L11.954 1.417c-1.083-1.89-3.834-1.89-4.917 0L.369 12.79C-.693 14.66.661 17 2.85 17"
          fill="#DC2E2E"
          fillRule="evenodd"
        />
      </WarningContainer>
    )
  }
}

const WarningContainer = styled('svg')``

export default Warning

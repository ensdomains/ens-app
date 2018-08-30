import React, { Component } from 'react'
import styled from 'react-emotion'
import Tick from './Tick'
import { render } from '../../../node_modules/react-testing-library'

const CheckboxContainer = styled('div')`
  input {
    display: none;
  }

  label {
    font-size: 22px;
    font-weight: 200;
    color: #5f5f5f;
    text-transform: capitalize;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &:hover {
      cursor: pointer;
    }
  }

  span {
    margin-left: 8px;
  }
`

class Checkbox extends Component {
  state = {
    hover: false
  }

  render() {
    const { onClick, checked, name, children } = this.props
    return (
      <CheckboxContainer onClick={onClick}>
        <label
          htmlFor={name}
          onMouseOver={() => this.setState({ hover: true })}
          onMouseOut={() => this.setState({ hover: false })}
        >
          <Tick active={checked ? true : false} hover={this.state.hover} />
          <span>{children}</span>
        </label>
        <input type="checkbox" name={name} checked={checked} readOnly />
      </CheckboxContainer>
    )
  }
}

export default Checkbox

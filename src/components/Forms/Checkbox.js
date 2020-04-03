import React, { useState } from 'react'
import styled from '@emotion/styled'
import Tick from './Tick'

const CheckboxContainer = styled('div')`
  align-self: center;
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

function Checkbox({ className, onClick, checked, name, children, testid }) {
  const [hover, setHover] = useState(false)
  return (
    <CheckboxContainer
      data-testid={testid}
      className={className}
      onClick={onClick}
    >
      <label
        htmlFor={name}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <Tick active={checked ? true : false} hover={hover} />
        <span>{children}</span>
      </label>
      <input type="checkbox" name={name} checked={checked} readOnly />
    </CheckboxContainer>
  )
}

export default Checkbox

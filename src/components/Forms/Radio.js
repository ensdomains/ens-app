import React, { Fragment } from 'react'
import styled from '@emotion/styled/macro'

const RadioContainer = styled('div')`
  display: flex;
  label {
    color: #b0becf;
    text-transform: capitalize;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 100px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #b0becf;
    transition: 0.2s ease-out;
    margin-right: 10px;
    &:hover {
      cursor: pointer;
      color: #5284ff;
      border: 2px solid #5284ff;
    }
  }

  input {
    display: none;
  }

  input:checked + label {
    color: #5284ff;
    border: 2px solid #5284ff;
  }

  .option {
  }
`

const Radio = ({ name, options }) => (
  <RadioContainer>
    {options.map((option, i) => (
      <div key={i} className="option">
        <input
          type="radio"
          value={option}
          name={name}
          id={option}
          defaultChecked={i === 0 ? true : false}
        />
        <label htmlFor={option}>{option}</label>
      </div>
    ))}
  </RadioContainer>
)

export default Radio

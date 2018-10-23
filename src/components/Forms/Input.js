import React from 'react'
import styled from 'react-emotion'
import tick from '../../assets/greenTick.svg'
import warning from '../../assets/warning.svg'

const StyledInput = styled('input')`
  ${({ wide }) => wide && 'width: 100%'};
  background: #ffffff;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 4px 0 rgba(181, 177, 177, 0.5);
  border-radius: 8px;
  height: 42px;
  font-family: Overpass Mono;
  font-weight: 300;
  font-size: 14px;
  color: #2b2b2b;
  letter-spacing: 0;
  padding: 10px 20px;
  &:focus {
    outline: 0;
  }
  ${p =>
    p.large &&
    `
    font-size: 18px;
  `};
  ${p =>
    p.invalid &&
    `  
    color: #DC2E2E
  `};
`

const InputContainer = styled('div')`
  position: relative;

  ${p => {
    if (p.valid) {
      return `
        &:before {
          background: url(${tick});
          content: '';
          height: 14px;
          width: 20px;
          position: absolute;
          right: 20px;
          top: 22px;
          transform: translateY(-50%);
        }
      `
    } else if (p.invalid) {
      return `
        &:before {
          background: url(${warning});
          content: '';
          height: 17px;
          width: 19px;
          position: absolute;
          right: 20px;
          top: 22px;
          transform: translateY(-50%);
        }
      `
    }
  }};
`

const Input = ({ className, type, onChange, valid, invalid, large }) => (
  <InputContainer valid={valid} invalid={invalid} className={className}>
    <StyledInput
      onChange={onChange}
      type={type ? type : 'text'}
      wide
      large={large}
      invalid={invalid}
    />
  </InputContainer>
)

export default Input

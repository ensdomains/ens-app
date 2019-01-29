import React from 'react'
import styled from 'react-emotion'
import tick from '../../assets/greenTick.svg'
import warning from '../../assets/warning.svg'
import yellowwarning from '../../assets/yellowwarning.svg'

import mq from 'mediaQuery'

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
    font-size: 14px;
  `};

  ${p =>
    p.large &&
    mq.small`
    font-size: 18px;
  `};
  ${p =>
    p.invalid &&
    `  
    color: #DC2E2E
  `};
  ${p =>
    p.warning &&
    `  
    color: #F5A623
  `};
`

const InputContainer = styled('div')`
  position: relative;
  margin-bottom: 20px;

  ${p => {
    if (p.invalid || p.warning) {
      return `
        &:before {
          background: url(${ p.warning ? yellowwarning : warning});
          content: '';
          height: 17px;
          width: 19px;
          position: absolute;
          right: 20px;
          top: 22px;
          transform: translateY(-50%);
        }
      `
    } else if (p.valid) {
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
    }
  }};
`

const Input = ({
  className,
  type,
  onChange,
  valid,
  warning,
  invalid,
  large,
  placeholder,
  value
}) => (
  <InputContainer
    valid={valid}
    warning={warning}
    invalid={invalid}
    className={className}
  >
    <StyledInput
      onChange={onChange}
      type={type ? type : 'text'}
      wide
      value={value}
      large={large}
      invalid={invalid}
      placeholder={placeholder}
    />
  </InputContainer>
)

export default Input

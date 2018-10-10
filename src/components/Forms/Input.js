import React from 'react'
import styled from 'react-emotion'

const StyledInput = styled('input')`
  ${({ wide }) => wide && 'width: 100%'};
  background: #ffffff;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 4px 0 rgba(181, 177, 177, 0.5);
  border-radius: 8px;
  height: 42px;
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #2b2b2b;
  letter-spacing: 0;
  padding: 10px 20px;
  &:focus {
    outline: 0;
  }
`

const Input = ({ className, type }) => (
  <StyledInput className={className} type={type ? type : 'text'} wide />
)

export default Input

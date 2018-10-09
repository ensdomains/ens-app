import React from 'react'
import styled from 'react-emotion'

const StyledInput = styled('input')``

const Input = ({ className, type }) => (
  <StyledInput className={className} type={type ? type : 'text'} wide />
)

export default Input

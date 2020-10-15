import React from 'react'
import styled from '@emotion/styled/macro'
import { getPlaceholder } from '../../utils/records'
import DefaultInput from '../Forms/Input'

const Input = styled(DefaultInput)`
  width: 100%;
  ${p =>
    p.hasBeenUpdated
      ? `
    input {
      border: #5284FF solid 1px;
    }
    
  `
      : ``}
`

const RecordInput = ({
  onChange,
  value,
  isValid,
  isInvalid,
  dataType,
  contentType,
  placeholder,
  hasBeenUpdated,
  testId
}) => {
  return (
    <Input
      hasBeenUpdated={hasBeenUpdated}
      warning={dataType === 'content' && contentType === 'oldcontent'}
      valid={isValid && hasBeenUpdated}
      value={value}
      invalid={isInvalid}
      placeholder={placeholder || getPlaceholder(dataType, contentType)}
      onChange={onChange}
      testId={testId}
    />
  )
}

export default RecordInput

import React from 'react'
import styled from '@emotion/styled/macro'
import { getPlaceholder } from '../../utils/records'
import DefaultInput from '../Forms/Input'

const Input = styled(DefaultInput)`
  width: 100%;
`

const RecordInput = ({
  onChange,
  value,
  isValid,
  isInvalid,
  dataType,
  contentType,
  placeholder
}) => {
  return (
    <Input
      warning={dataType === 'content' && contentType === 'oldcontent'}
      valid={isValid}
      value={value}
      invalid={isInvalid}
      placeholder={placeholder || getPlaceholder(dataType, contentType)}
      onChange={onChange}
    />
  )
}

export default RecordInput

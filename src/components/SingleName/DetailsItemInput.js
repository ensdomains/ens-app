import React from 'react'
import styled from '@emotion/styled/macro'
import { getPlaceholder, trimRecord } from '../../utils/records'
import DefaultInput from '../Forms/Input'

const Input = styled(DefaultInput)`
  width: 100%;
`

const DetailsItemInput = ({
  updateValue,
  isValid,
  isInvalid,
  dataType,
  contentType,
  placeholder,
  newValue
}) => {
  return (
    <Input
      warning={dataType === 'content' && contentType === 'oldcontent'}
      valid={isValid}
      invalid={isInvalid}
      placeholder={placeholder || getPlaceholder(dataType, contentType)}
      onChange={e => {
        updateValue(trimRecord(contentType, e.target.value))
      }}
      value={newValue}
    />
  )
}

export default DetailsItemInput

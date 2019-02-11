import React from 'react'
import { encode } from '../../utils/contents'
import styled from 'react-emotion'
import { getPlaceholder } from '../../utils/records'
import DefaultInput from '../Forms/Input'

const Input = styled(DefaultInput)`
  width: 100%;
`

const DetailsItemInput = ({
  updateValue,
  isValid,
  isInvalid,
  dataType,
  contentType
}) => {
  return (
    <Input
      warning={dataType === 'content' && contentType === 'oldcontent'}
      valid={isValid}
      invalid={isInvalid}
      placeholder={getPlaceholder(dataType, contentType)}
      onChange={e => {
        if (dataType === 'address' || contentType === 'oldcontent') {
          updateValue(e.target.value)
        } else if (contentType === 'contenthash') {
          let encoded = encode(e.target.value)
          if (encoded) {
            updateValue(encoded)
          } else {
            updateValue('0x')
          }
        } else {
          console.warn('unsupported type')
        }
      }}
    />
  )
}

export default DetailsItemInput

import React from 'react'
import { encode } from '../../utils/contents'
import styled from 'react-emotion'
import { getPlaceholder } from '../../utils/records'
import DefaultInput from '../Forms/Input'

const Input = styled(DefaultInput)`
  margin-left: 20px;
  width: 100%;
`

const DetailsItemInput = ({
  updateValue,
  newValue,
  isValid,
  isInvalid,
  dataType
}) => {
  return(
      <Input
        valid={isValid}
        invalid={isInvalid}
        placeholder={getPlaceholder(dataType)}
        onChange={e => {
          if(e && e.target && e.target.value){
            if(dataType === 'address'){
              updateValue(e.target.value)
            }else{
              let encoded = encode(e.target.value)
              if(encoded){
                updateValue(encoded)
              }else{
                updateValue('0x')
              }
            }
          }
        }}
    /> 
  )
}

export default DetailsItemInput

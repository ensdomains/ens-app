import styled from 'styled-components'
import React from 'react'

const NAME_WRAPPER_INFO_LINK = 'https://github.com/ensdomains/name-wrapper'

const NameWrapperWarningContianer = styled.div`
  margin-bottom: 40px;
  text-align: center;
`

const NameWrapperWarning = () => {
  return (
    <NameWrapperWarningContianer>
      ⚠️ <strong>Attention</strong>: This name has been wrapped in order to give
      it extra functionality. Find out more info{' '}
      <a href={NAME_WRAPPER_INFO_LINK} target="_blank">
        here
      </a>
      .
    </NameWrapperWarningContianer>
  )
}

export default NameWrapperWarning

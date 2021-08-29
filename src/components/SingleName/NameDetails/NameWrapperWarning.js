import styled from 'styled-components'
import React from 'react'

const NAME_WRAPPER_INFO_LINK = ''

const NameWrapperWarningContianer = styled.div`
  margin-bottom: 40px;
  text-align: center;
`

export const NameWrapperWarning = () => {
  return (
    <NameWrapperWarningContianer>
      ⚠️ <strong>Attention</strong>: This name has been wrapped in order to give
      it extra functionality. Find out more info{' '}
      <a href="https://github.com/ensdomains/name-wrapper" target="_blank">
        here
      </a>
      .
    </NameWrapperWarningContianer>
  )
}

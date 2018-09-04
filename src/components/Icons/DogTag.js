import React from 'react'
import styled from 'react-emotion'
import Icon from './IconBase'

const SVG = styled(Icon)``

const DogTag = ({ active }) => (
  <SVG width="23" height="23" active={active}>
    <path
      d="M9.067 9.111a2.234 2.234 0 0 1-1.556.667 2.233 2.233 0 0 1-1.555-.667c-.445-.4-.667-.978-.667-1.556 0-.577.267-1.155.667-1.6.4-.444.978-.666 1.555-.666.578 0 1.112.222 1.556.666a2.2 2.2 0 0 1 0 3.156M21.91 11.29L11.423.89C10.889.355 10.133.044 9.378 0h-.133L1.823 1.244a.66.66 0 0 0-.578.578L0 9.244v.134c0 .755.31 1.511.889 2.044l10.445 10.445a3.533 3.533 0 0 0 2.533 1.066c.844 0 1.689-.31 2.356-.978L22 16.178c1.334-1.334 1.289-3.51-.09-4.889"
      fill="#C7D3E3"
      fillRule="evenodd"
    />
  </SVG>
)

export default DogTag

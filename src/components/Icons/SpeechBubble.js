import React from 'react'
import styled from 'react-emotion'
import Icon from './IconBase'

const SVG = styled(Icon)``

const SpeechBubble = ({}) => (
  <SVG width="23" height="20">
    <path
      d="M16.57 9.02a1.53 1.53 0 0 1-1.539-1.53c0-.867.666-1.528 1.54-1.528.831 0 1.538.661 1.538 1.529a1.53 1.53 0 0 1-1.539 1.53m-5.073.04a1.53 1.53 0 1 1 0-3.058c.832 0 1.539.662 1.539 1.53a1.53 1.53 0 0 1-1.54 1.528m-5.072 0a1.53 1.53 0 1 1 0-3.058c.873 0 1.539.662 1.539 1.53a1.53 1.53 0 0 1-1.54 1.528M20.236.001H2.327C1.03 0-.033 1.022 0 2.31V13.11a2.326 2.326 0 0 0 2.326 2.311h.498v3.764c0 .297.399.43.598.232l3.988-3.996h12.824c1.263 0 2.326-1.023 2.326-2.311V2.312A2.325 2.325 0 0 0 20.235 0"
      fill="#5284FF"
      fillRule="evenodd"
    />
  </SVG>
)

export default SpeechBubble

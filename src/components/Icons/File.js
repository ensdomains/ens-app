import React from 'react'
import styled from '@emotion/styled'
import Icon from './IconBase'

const SVG = styled(Icon)``

const File = ({ active, className }) => (
  <SVG width="25" height="19" active={active} className={className}>
    <g fill-rule="evenodd">
      <path d="M22.724 0H6.14C5.068 0 4.2 1.022 4.2 2.284v.662h15.513c1.326 0 2.424 1.293 2.424 2.856v8.206h.587c1.071 0 1.939-1.022 1.939-2.285V2.284c0-1.262-.868-2.284-1.94-2.284" />
      <path d="M20.436 11.333v-4.51c.026-1.232-.842-2.254-1.913-2.254H1.939C.868 4.569 0 5.591 0 6.854v5.861h.026v3.548c0 1.262.867 2.284 1.939 2.284h16.583c1.072 0 1.94-1.022 1.94-2.284v-4.93h-.052z" />
    </g>
  </SVG>
)

export default File

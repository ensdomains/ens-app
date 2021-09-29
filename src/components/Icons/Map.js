import React from 'react'
import styled from '@emotion/styled/macro'

const MapContainer = styled('svg')``

const Map = ({ color = '#5284FF' }) => (
  <MapContainer width="40" height="14" xmlns="http://www.w3.org/2000/svg">
    <g fill={color} fillRule="evenodd">
      <rect y=".875" width="12.727" height="12.25" rx="1.152" />
      <ellipse cx="32.727" cy="7" rx="7.273" ry="7" />
      <rect x="14.545" y="6.125" width="9.091" height="3.5" rx="1.75" />
    </g>
  </MapContainer>
)

export default Map

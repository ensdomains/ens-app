import styled from 'react-emotion'

const Icon = styled('svg')`
  path {
    fill: ${p => (p.color ? p.color : p.active ? '#5284FF' : '#C7D3E3')};
    width: ${p => p.width}px;
  }
`

export default Icon

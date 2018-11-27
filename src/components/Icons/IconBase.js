import styled from 'react-emotion'

const Icon = styled('svg')`
  path {
    transition: 0.2s;
    fill: ${p => (p.color ? p.color : p.active ? '#5284FF' : '#C7D3E3')};
    width: ${p => p.width}px;
  }
`

export default Icon

import styled from 'react-emotion'

const Icon = styled('svg')`
  path {
    fill: ${p => (p.active ? '#5284FF' : '#C7D3E3')};
  }
`

export default Icon

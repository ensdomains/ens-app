import styled from '@emotion/styled/macro'

const Icon = styled('svg')`
  path {
    transition: 0.2s;
    fill: ${p => (p.color ? p.color : p.active ? '#282929' : '#282929')};
    width: ${p => p.width}px;
  }

  g {
    fill: ${p => (p.color ? p.color : p.active ? '#282929' : '#282929')};
  }
`

export default Icon

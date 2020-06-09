import styled from '@emotion/styled/macro'
import { ReactComponent as Pencil } from '../Icons/Pencil.svg'

const StyledPencil = styled(Pencil)`
  ${p =>
    p.disabled &&
    `
     g {
       fill: #ADBBCD;
     }
  `}
  &:hover {
    g {
      transition: 0.2s;
      fill: #5384fe;
    }
    cursor: pointer;
  }

  ${p =>
    p.disabled &&
    `
    &:hover {
      cursor: default;
      g {
        fill: #ADBBCD;
      }
    }
  `}
`

export default StyledPencil

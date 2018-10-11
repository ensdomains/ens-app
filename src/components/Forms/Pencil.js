import styled from 'react-emotion'
import { ReactComponent as Pencil } from '../Icons/Pencil.svg'

const StyledPencil = styled(Pencil)`
  &:hover {
    g {
      transition: 0.2s;
      fill: #5384fe;
    }
    cursor: pointer;
  }
`

export default StyledPencil

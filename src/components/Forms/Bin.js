import styled from 'react-emotion'
import { ReactComponent as Bin } from '../Icons/Bin.svg'

const StyledBin = styled(Bin)`
  &:hover {
    g {
      transition: 0.2s;
      fill: #5384fe;
    }

    cursor: pointer;
  }
`

export default StyledBin

import styled from '@emotion/styled/macro'
import { ReactComponent as Bin } from '../Icons/Bin.svg'

const StyledBin = styled(Bin)`
  flex-shrink: 0;
  &:hover {
    g {
      transition: 0.2s;
      fill: #bd393a;
    }

    cursor: pointer;
  }
`

export default StyledBin

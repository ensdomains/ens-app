import styled from 'react-emotion'

export const DetailsItem = styled('div')`
  display: flex;
  justify-content: flex-start;
`

export const DetailsKey = styled('div')`
  color: ${({ greyed }) => (greyed ? '#CCD4DA' : '2b2b2b')};
  font-size: 16px;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: uppercase;
  width: 220px;
  margin-bottom: 20px;
`

export const DetailsValue = styled('div')`
  font-size: 18px;
  font-weight: 100;
  font-family: Overpass Mono;
`

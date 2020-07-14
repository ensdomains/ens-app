import React from 'react'
import createIcon from '../utils/blockies'
import PropTypes from 'prop-types'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'

const BlockiesContainer = styled('span')``

const Blockies = ({
  address,
  imageSize = 42,
  color,
  bgcolor,
  spotcolor,
  className
}) => {
  let { t } = useTranslation()

  if (!address) return <>{t('blockies.noAddressFound')}</>
  var imgURL = createIcon({
    seed: address.toLowerCase(),
    size: 8,
    scale: 5,
    color,
    bgcolor,
    spotcolor
  }).toDataURL()
  var style = {
    backgroundImage: 'url(' + imgURL + ')',
    backgroundSize: 'cover',
    width: imageSize + 'px',
    height: imageSize + 'px',
    display: 'inline-block'
  }

  return <BlockiesContainer className={className} style={style} />
}

Blockies.propTypes = {
  address: PropTypes.string.isRequired,
  imageSize: PropTypes.number,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  spotcolor: PropTypes.string,
  className: PropTypes.string
}

export default Blockies

export const SingleNameBlockies = styled(Blockies)`
  margin-right: 10px;
  border-radius: 50%;
  box-shadow: 2px 2px 9px 0 #e1e1e1;
  flex-shrink: 0;
`

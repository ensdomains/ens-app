import styled from '@emotion/styled/macro'
import MushroomIcon from './images/Mushroom.svg'
import LayersIcon from './images/Layers.svg'
import Arrow from './images/Arrow.svg'
import { motion } from 'framer-motion'

const LogoContainer = styled(motion.img)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: auto;
  display: block;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`

const Link = styled(`a`)`
  display: block;
`
const ArrowSmall = styled(motion.img)`
  margin: auto;
  display: block;
  width: 22px;
  color: #b3b3b3;
`

const BannerTitle = styled(`div`)`
  color: #0e0e0e;
  letter-spacing: -0.01em;
  font-weight: bold;
  font-size: 18px;
`

const BannerContent = styled(`div`)`
  color: #787878;
  letter-spacing: -0.01em;
  font-weight: 500;
  font-size: 15px;
`

const BannerContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
`

const Emphasized = styled.span`
  color: #628bf3;
`

const NameWrapperBanner = ({ isWrapped = false }) => {
  const logo = isWrapped ? LayersIcon : MushroomIcon
  const testId = isWrapped
    ? 'banner-namewrapper-edit'
    : 'banner-namewrapper-upgrade'
  return (
    <Link target="_blank" rel="noreferrer" href="" data-testid={testId}>
      <LogoContainer src={logo} alt="Name wrapper logo" />
      <BannerContentWrapper>
        <BannerTitle>
          {isWrapped ? (
            <>
              <span>Visit the </span>
              <Emphasized>new Manager</Emphasized>
              <span> to edit your upgraded name</span>
            </>
          ) : (
            <span>Wrap your name to upgrade functionality</span>
          )}
        </BannerTitle>
        <BannerContent>
          {isWrapped ? (
            <span>
              Since this is a wrapped name, you must use the new version of the
              Manager to modify records.
            </span>
          ) : (
            <>
              <span>Migrate your name to the new </span>
              <Emphasized>
                <u>smart contract</u>
              </Emphasized>
              <span>
                {' '}
                for additional permissions & features. This will require gas.
              </span>
            </>
          )}
        </BannerContent>
      </BannerContentWrapper>
      <ArrowSmall src={Arrow} alt="Arrow right icon" />
    </Link>
  )
}

export default NameWrapperBanner

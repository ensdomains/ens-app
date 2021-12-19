import React, { createRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'
import { useQuery, gql } from '@apollo/client'
import { GET_REVERSE_RECORD } from '../../graphql/queries'
import avatar from '../../assets/avatar.png'

import UnstyledBlockies from '../Blockies'
import { useOnClickOutside } from 'components/hooks'
import { imageUrl } from '../../utils/utils'
import SideNav from 'components/SideNav/SideNav'

const ActiveAvatar = styled('div')`
  color: #fff;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
  align-items: center;
  span {
    margin-right: 10px;
  }

  &:hover {
    cursor: pointer;
  }
`

const AvatarAndInfoDropdownContainer = styled('div')`
  position: relative;
`

const Dropdown = styled(motion.div)`
  position: absolute;
  background: white;
  top: 100%;
  right: 10px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: -4px 18px 70px 0 rgba(108, 143, 167, 0.32);
  width: 230px;
  padding: 20px 0;
  z-index: 2;
`

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    accounts
    isReadOnly
    isSafeApp
    avatar
    network
    displayName
  }
`
const Avatar = styled('img')`
  width: 37px;
  position: absolute;
  left: 10px;
  top: 10px;
  border-radius: 50%;
  ${mq.medium`
    box-shadow: 3px 5px 24px 0 #d5e2ec;
  `}
`

const Blockies = styled(UnstyledBlockies)`
  border-radius: 50%;
  position: absolute;
  left: 10px;
  top: 25px;
`

const DefaultAvatar = styled('img')`
  position: relative;
  width: 37px;
  height: 37px;
  left: 10px;
  top: 25px;
  cursor: pointer;
`

export default function AvatarAndInfoDropdown({ match }) {
  const dropdownRef = createRef()
  const togglerRef = createRef()
  const [showDropdown, setShowDropdown] = useState(false)
  const { i18n } = useTranslation()

  useOnClickOutside([dropdownRef, togglerRef], () => setShowDropdown(false))

  const { t } = useTranslation()
  const {
    data: { accounts, isSafeApp, network, displayName, isReadOnly }
  } = useQuery(NETWORK_INFORMATION_QUERY)

  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address: accounts?.[0]
    },
    skip: !accounts?.length
  })

  return (
    <AvatarAndInfoDropdownContainer>
      {!isReadOnly ? (
        <ActiveAvatar
          ref={togglerRef}
          onClick={() => setShowDropdown(show => !show)}
        >
          {!reverseRecordLoading &&
          getReverseRecord &&
          getReverseRecord.avatar ? (
            <Avatar
              src={imageUrl(getReverseRecord.avatar, displayName, network)}
            />
          ) : (
            <Blockies address={accounts[0]} imageSize={37} />
          )}
        </ActiveAvatar>
      ) : (
        <DefaultAvatar
          ref={togglerRef}
          onClick={() => setShowDropdown(show => !show)}
          src={avatar}
        />
      )}

      {showDropdown && (
        <AnimatePresence>
          <Dropdown
            ref={dropdownRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <SideNav />
          </Dropdown>
        </AnimatePresence>
      )}
    </AvatarAndInfoDropdownContainer>
  )
}

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled/macro'

import RotatingSmallCaret from '../Icons/RotatingSmallCaret'

const LANGUAGES = [
  {
    value: 'en',
    label: 'English (EN)'
  },
  {
    value: 'cn',
    label: 'Chinese (简体中文)'
  },
  {
    value: 'ja',
    label: 'Japanese (日本語)'
  }
]

function getLang(lang) {
  return LANGUAGES.find(l => l.value === lang)
}

const ActiveLanguage = styled('div')`
  color: #adbbcd;
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

const LanguageSwitcherContainer = styled('div')`
  background: white;
  position: relative;
`

const Dropdown = styled(motion.div)`
  position: absolute;
  background: white;
  top: 100%;
  right: 0;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: -4px 18px 70px 0 rgba(108, 143, 167, 0.32);
  width: 230px;
  li {
    color: #adbbcd;
    padding: 20px 30px;
    border-bottom: 1px solid #dfdfdf;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
      color: #2b2b2b;
      cursor: pointer;
      div {
        /* ball */
        background: #5284ff;
      }
    }
    &:last-child {
      border-bottom: none;
    }
  }
`

const Ball = styled('div')`
  border-radius: 50%;
  background: white;
  width: 10px;
  height: 10px;
  box-shadow: 0 0 0 3px white, 0 0 0 4px #5284ff;
  ${p =>
    p.selected &&
    `
    background: #5284ff;
  `}
`

function saveLanguageToLocalStorage(value) {
  window.localStorage.setItem('language', value)
}

function getLanguageFromLocalStorage() {
  return window.localStorage.getItem('language')
}

export default function LanguageSwitcher() {
  const [languageSelected, setLanguageSelected] = useState(
    getLang(getLanguageFromLocalStorage()) ?? getLang('en')
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const { i18n } = useTranslation()

  function changeLanguage(language) {
    setLanguageSelected(language)
    saveLanguageToLocalStorage(language.value)
    i18n.changeLanguage(language.value)
    setShowDropdown(false)
  }

  return (
    <LanguageSwitcherContainer>
      <ActiveLanguage onClick={() => setShowDropdown(show => !show)}>
        <span>{languageSelected.value}</span>
        <RotatingSmallCaret
          start="top"
          rotated={showDropdown}
          highlight={true}
        />
      </ActiveLanguage>
      {showDropdown && (
        <AnimatePresence>
          <Dropdown
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {LANGUAGES.map(language => {
              return (
                <li onClick={() => changeLanguage(language)}>
                  {language.label}
                  <Ball selected={languageSelected.value === language.value} />
                </li>
              )
            })}
          </Dropdown>
        </AnimatePresence>
      )}
    </LanguageSwitcherContainer>
  )
}

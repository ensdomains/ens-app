import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'

const LANGUAGES = [
  {
    value: 'en',
    label: 'English (EN)'
  },
  {
    value: 'cn',
    label: 'Chinese (簡體中文)'
  }
]

function getLang(lang) {
  return LANGUAGES.find(l => l.value === lang)
}

const ActiveLanguage = styled('div')``

const LanguageSwitcherContainer = styled('div')``

const Dropdown = styled(motion.div)``

export default function LanguageSwitcher() {
  const [languageSelected, setLanguageSelected] = useState(getLang('en'))

  console.log(languageSelected)
  const [showDropdown, setShowDropdown] = useState(false)
  const { i18n } = useTranslation()

  function changeLanguage(language) {
    setLanguageSelected(language)
    i18n.changeLanguage(language.value)
  }

  return (
    <LanguageSwitcherContainer>
      <ActiveLanguage onClick={() => setShowDropdown(show => !show)}>
        {languageSelected.label}
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
                </li>
              )
            })}
          </Dropdown>
        </AnimatePresence>
      )}
    </LanguageSwitcherContainer>
  )
}

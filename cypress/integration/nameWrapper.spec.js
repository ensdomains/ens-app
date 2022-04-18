const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

const DISABLED_COLOUR = 'rgb(223, 223, 223)'

function waitUntilInputResolves(buttonTextOrOptions) {
  return cy.waitUntilInputResolves(buttonTextOrOptions)
}

function waitUntilTestIdDoesNotExist(testId) {
  return cy.waitUntilTestIdDoesNotExist(testId)
}

function waitUntilTextDoesNotExist(text) {
  return cy.waitUntilTextDoesNotExist(text)
}

function confirmRecordUpdate() {
  cy.wait(1000)
  cy.getByTestId('action').click({ force: true })
  cy.wait(1000)
  cy.getByTestId('send-transaction').click({
    force: true
  })
  cy.wait(1000)
}

function refreshAndCheckText(url, textOrArrayOfText) {
  cy.visit(url)
  cy.wait(10000)
  if (typeof textOrArrayOfText === 'string') {
    cy.queryByText(textOrArrayOfText, { timeout: 20000 }).should('exist')
  } else {
    textOrArrayOfText.forEach(text =>
      cy.queryByText(text, { timeout: 20000 }).should('exist')
    )
  }
}

describe('Name Wrapper Tests', () => {
  describe('page with wrapped name', () => {
    it('should have details be read only', () => {
      cy.visit(`${NAME_ROOT}/wrappedname.eth/details`, { timeout: 10000 })
      cy.wait(3000)
      cy.getByTestId('edit-registrant').should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
      )
      cy.getByTestId('edit-controller').should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
      )
      cy.getByTestId('edit-expiration date').should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
      )
      cy.getByTestId('edit-resolver').should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
      )
      cy.contains('Add/Edit Record').should('not.exist')
    })

    it('should display edit name wrapper', () => {
      cy.visit(`${NAME_ROOT}/wrappedname.eth/details`, { timeout: 10000 })
      cy.getByTestId('banner-namewrapper-edit').should('exist')
      cy.visit(`${NAME_ROOT}/wrappedname.eth/register`, { timeout: 10000 })
      cy.getByTestId('banner-namewrapper-edit').should('exist')
      cy.visit(`${NAME_ROOT}/subdomain.wrappedname.eth/details`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })

    it('should have subdomains be read only', () => {
      cy.visit(`${NAME_ROOT}/wrappedname.eth/subdomains`, { timeout: 10000 })
      cy.waitUntilTestIdDoesNotExist('addsubdomain')
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })
  })

  describe('page with wrapped subdomain', () => {
    it('should have details be read only', () => {
      cy.visit(`${NAME_ROOT}/subdomain.wrappedname.eth/details`, {
        timeout: 10000
      })
      cy.getByTestId('edit-controller').should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
      )
      cy.getByTestId('edit-resolver').should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
      )
      cy.contains('Add/Edit Record').should('not.exist')
    })

    it('should display edit name wrapper banner', () => {
      cy.visit(`${NAME_ROOT}/subdomain.wrappedname.eth/details`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-edit').should('exist')
      cy.visit(`${NAME_ROOT}/subdomain.wrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })

    it('should have subdomains be read only', () => {
      cy.visit(`${NAME_ROOT}/subdomain.wrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.waitUntilTestIdDoesNotExist('addsubdomain')
    })
  })

  describe('page with unwrapped subdomain of wrapped domain', () => {
    it('should have details in normal mode', () => {
      cy.visit(`${NAME_ROOT}/unwrapped.wrappedname.eth/details`, {
        timeout: 10000
      })
      cy.wait(3000)

      cy.waitUntilTestIdDoesNotExist('edit-registrant')

      cy.getByTestId('edit-controller').should(
        'have.css',
        'background-color',
        'rgb(83, 132, 254)'
      )
      cy.getByTestId('edit-resolver').should(
        'have.css',
        'background-color',
        'rgb(83, 132, 254)'
      )
      cy.contains('Add/Edit Record').should('not.exist')
    })

    it('should display upgrade name wrapper banner', () => {
      cy.visit(`${NAME_ROOT}/unwrapped.wrappedname.eth/details`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
    })

    it('should have subdomains be in normal mode', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.wait(3000)
      cy.getByTestId('addsubdomain').should('exist')
    })
  })

  describe('page with domain that was wrapped but expired and reregistered', () => {
    it('should have details in normal mode', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/details`, {
        timeout: 10000
      })
      cy.wait(10000)
      cy.getByTestId('edit-registrant').should(
        'have.css',
        'background-color',
        'rgb(83, 132, 254)'
      )
      cy.getByTestId('edit-controller').should(
        'have.css',
        'background-color',
        'rgb(83, 132, 254)'
      )
      cy.getByTestId('edit-expiration date').should(
        'have.css',
        'background-color',
        'rgb(83, 132, 254)'
      )
      cy.getByTestId('edit-resolver').should(
        'have.css',
        'background-color',
        'rgb(83, 132, 254)'
      )
      cy.contains('Add/Edit Record').should('exist')
    })

    it('should have subdomains be in normal mode', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.wait(3000)
      cy.getByTestId('addsubdomain').should('exist')
    })

    it('should display upgrade namewrapper banner', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/details`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/register`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
    })
  })
})

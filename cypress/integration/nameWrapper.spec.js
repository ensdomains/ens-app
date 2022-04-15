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
  describe('page should be in read only mode if domain is wrapped', () => {
    it('detaials page should be in read only mode', () => {
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
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })

    it('register page should display edit name wrapper banner', () => {
      cy.visit(`${NAME_ROOT}/wrappedname.eth/register`, { timeout: 10000 })
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })

    it('subdomains should be read only', () => {
      cy.visit(`${NAME_ROOT}/wrappedname.eth/subdomains`, { timeout: 10000 })
      cy.waitUntilTestIdDoesNotExist('addsubdomain')
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })
  })

  describe('should be in read only mode if subdomain is name wrapped', () => {
    it('detaials page should be in read only mode', () => {
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
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })

    it('subdomains page should be in read only mode', () => {
      cy.visit(`${NAME_ROOT}/subdomain.wrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.waitUntilTestIdDoesNotExist('addsubdomain')
      cy.getByTestId('banner-namewrapper-edit').should('exist')
    })
  })

  describe('page should be in normal mode if subdomian of wrapped domain is unwrapped', () => {
    it('details page should be normal mode', () => {
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
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
    })

    it('page should be in normal mode', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.wait(3000)
      cy.getByTestId('addsubdomain').should('exist')
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
    })
  })

  describe('page should be in normal mode if wrapped domaing, expiredwrappedname.eth, has expired and was registered again', () => {
    it('detaials page should not be in normal mode if wrapped domain has expired and is reregistered', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/details`, {
        timeout: 10000
      })
      cy.wait(3000)
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
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
    })

    it('register page should be in normal mode', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/register`, {
        timeout: 10000
      })
      cy.wait(3000)
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
    })

    it('page should be in normal mode', () => {
      cy.visit(`${NAME_ROOT}/expiredwrappedname.eth/subdomains`, {
        timeout: 10000
      })
      cy.wait(3000)
      cy.getByTestId('addsubdomain').should('exist')
      cy.getByTestId('banner-namewrapper-upgrade').should('exist')
    })
  })
})

const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('PermanentRegistrar', () => {
  it('can visit a name and register it', () => {
    cy.visit(`${ROOT}/name/vitalik.eth`)
    cy.getByTestId('request-register-button').click({ force: true })
    cy.getByTestId('register-button', { timeout: 10000 }).click({
      force: true,
      timeout: 10000
    })
    cy.getByTestId('manage-name-button').click({ force: true })

    cy.getByTestId('details-value-registrant', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
    cy.getByTestId('details-value-controller', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
  })
  it('shows premium', () => {
    cy.visit(`${ROOT}/name/rel.eth`)
    cy.queryByText('This name has a temporary premium', {
      exact: false
    }).should('exist')
    cy.queryByText('Price per amount of time selected', {
      exact: false
    }).should('exist')
  })
  it('does not show released owner info', () => {
    cy.visit(`${ROOT}/name/rel.eth/details`)
    cy.getByTestId('details-value-registrant', {
      exact: false,
      timeout: 10000
    }).should('have.text', 'No address found')
    cy.getByTestId('details-value-controller', {
      exact: false,
      timeout: 10000
    }).should('have.text', 'No address found')
  })
  it('cannot register a name that is already owned', () => {
    cy.visit(`${ROOT}/name/resolver.eth`)
    cy.getByTestId('details-value-registrant', {
      exact: false,
      timeout: 10000
    }).should('have.text', Cypress.env('ownerAddress'))
    cy.getByTestId('details-value-controller', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
  })

  it('can visit a name and cannot register before the wait time is over', () => {
    cy.visit(`${ROOT}/name/vitalik2.eth`)
    cy.getByTestId('request-register-button').click({ force: true })
    cy.queryByText('register-button').should('not.exist')
  })

  it('cannot register too short name', () => {
    cy.visit(`${ROOT}/name/ab.eth`)
    cy.queryByText('request-register-button').should('not.exist')
    cy.queryByText('Name is too short', {
      exact: false
    }).should('exist')
  })

  it('cannot register malformated name', () => {
    cy.visit(`${ROOT}/name/ab eth`)
    cy.queryByText('request-register-button').should('not.exist')
    cy.queryByText('Domain malformed. ab eth is not a valid domain', {
      exact: false
    }).should('exist')
  })

  it('cannot register unsupported tld', () => {
    cy.visit(`${ROOT}/name/ab.cdef`)
    cy.queryByText('request-register-button').should('not.exist')
    cy.queryByText('CDEF is not currently a supported TLD', {
      exact: false
    }).should('exist')
  })
})

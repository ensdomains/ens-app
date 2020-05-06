const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('PermanentRegistrar', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
  })
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
})

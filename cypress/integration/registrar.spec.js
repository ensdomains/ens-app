const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('PermanentRegistrar', () => {
  it('can visit a name and register it', () => {
    cy.visit(`${ROOT}/name/vitalik.eth`)
    cy.getByTestId('request-register-button').click()
    cy.getByTestId('register-button').click()
    cy.getByTestId('manage-name-button').click()

    cy.getByTestId('details-value-owner', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
  })

  it('cannot register a name that is already owned', () => {
    cy.visit(`${ROOT}/name/vitalik.eth`)
    cy.getByTestId('details-value-owner', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
  })

  it('can visit a name and cannot register before the wait time is over', () => {
    cy.visit(`${ROOT}/name/vitalik2.eth`)
    cy.getByTestId('request-register-button').click()
    cy.queryByText('register-button').should('not.exist')
  })
})

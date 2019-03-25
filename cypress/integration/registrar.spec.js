const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('PermanentRegistrar', () => {
  it('can visit a name', () => {
    cy.visit(`${ROOT}/name/vitalik3.eth`)
    cy.getByTestId('request-register-button').click()
    cy.getByTestId('register-button').click()
    cy.getByTestId('manage-name-button').click()

    cy.getByTestId('details-value-owner', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
  })
})

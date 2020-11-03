const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Release Deed from Migrated Legacy registrar', () => {
  it('show link to reclaim page', () => {
    cy.visit(`${ROOT}/name/auctioned3.eth`)
    // The message appears when it recognised that the account can transfer
    cy.queryByTestId('owner-type', { timeout: 10000 }).should('exist')

    cy.queryByText('https://reclaim.ens.domains', {
      timeout: 5000,
      exact: false
    }).should('exist')
  })
})

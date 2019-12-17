const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Release Deed from Migrated Legacy registrar', () => {
  it('can visit a name and migrate it', () => {
    cy.visit(`${ROOT}/name/auctioned3.eth`)
    cy.getByText('Return').click({ force: true })
    cy.queryByText('Your deposit is now returned.', {
      timeout: 5000,
      exact: false
    }).should('exist')
    cy.queryByText('Return', { timeout: 50 }).should('not.exist')
  })
})

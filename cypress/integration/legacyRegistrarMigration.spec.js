const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Release Deed from Migrated Legacy registrar', () => {
  it('show link to reclaim page', () => {
    cy.visit(`${ROOT}/name/auctioned3.eth`)
    cy.queryByText('https://reclaim.ens.domains', {
      exact: false
    }).should('exist')
  })
})

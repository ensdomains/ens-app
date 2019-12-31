const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Migrate a subdomain to new registry', () => {
  it('can visit an unmigrated name and migrate it', () => {
    cy.visit(`${ROOT}/name/sub1.testing.eth`)
    cy.waitUntilHollowInputResolves('Migrate').then(() => {
      cy.getByText('Migrate').click({ force: true })
      cy.queryByText('migrate', { timeout: 50 }).should('not.exist')
    })

    // TODO add tests to check records
  })
})

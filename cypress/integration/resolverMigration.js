const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Migrate resolver and records', () => {
  it('can visit a name with an old resolver and migrate it', () => {
    cy.visit(`${ROOT}/name/abittooawesome2.eth`)
    cy.getByText('Migrate').click({ force: true })
    cy.queryByText('migrate', { timeout: 50 }).should('not.exist')

    // TODO add tests to check records
  })
})

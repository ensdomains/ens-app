const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Migrate resolver and records', () => {
  it('can visit a name with an old resolver and migrate it', () => {
    cy.visit(`${ROOT}/name/abittooawesome2.eth`)
    cy.getByText('Migrate').click({ force: true })
    cy.queryByText('migrate', { timeout: 50 }).should('not.exist')

    // TODO add tests to check records
  })

  it('can visit a name with a deprecated resolver but cannot add records', () => {
    cy.visit(`${ROOT}/name/abittooawesome3.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.queryByText(
        'You can’t edit or add records until you migrate to the new resolver',
        {
          timeout: 5000,
          exact: false
        }
      ).should('exist')
    })
  })
})

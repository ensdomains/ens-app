const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Migration to Permanent', () => {
  it('can visit a name and migrate it', () => {
    cy.visit(`${ROOT}/name/auctioned3.eth`)
    cy.getByText('Migrate').click()
    cy.wait(500)
    cy.getByTestId('details-value-owner', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )

    cy.queryByText('Migrate', { timeout: 50 }).should('not.exist')
  })

  it('can visit a name that is unfinalised and migrate it', () => {
    cy.visit(`${ROOT}/name/auctionednofinalise.eth`)
    cy.getByText('Migrate').click()
    cy.wait(500)
    cy.getByTestId('details-value-owner', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
    cy.queryByText('Migrate', { timeout: 50 }).should('not.exist')
  })

  it('cannot migrate a domain that is still in the lock period', () => {
    cy.visit(`${ROOT}/name/auctionedtoorecent.eth`)
    cy.queryByText('Migrate', { timeout: 1000 }).should('be.disabled')
  })

  it('cannot migrate a domain that is already on the permanent registrar', () => {
    cy.visit(`${ROOT}/name/newname.eth`)
    cy.queryByText('Migrate', { timeout: 50 }).should('not.exist')
  })
})

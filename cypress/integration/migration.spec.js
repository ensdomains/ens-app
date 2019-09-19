const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Migration to Permanent', () => {
  it('can visit a name and migrate it', () => {
    cy.visit(`${ROOT}/name/auctioned3.eth`)
    cy.getByText('Migrate').click({ force: true })
    cy.queryByText('Congratulations on Migrating your domain', {
      timeout: 5000,
      exact: false
    }).should('exist')
  })

  it('can visit a name that is unfinalised and migrate it', () => {
    cy.visit(`${ROOT}/name/auctionednofinalise.eth`)
    cy.getByText('Migrate').click({ force: true })
    cy.waitUntil(() => {
      return cy
        .getByTestId('details-value-controller', { exact: false })
        .then($el => $el.text() === Cypress.env('ownerAddress'))
    }).then(() => {
      cy.getByTestId('details-value-controller').should(
        'have.text',
        Cypress.env('ownerAddress')
      )
      cy.queryByText('Congratulations on Migrating your domain', {
        timeout: 50,
        exact: false
      }).should('exist')
    })
  })

  it('cannot migrate a domain that is still in the lock period', () => {
    cy.visit(`${ROOT}/name/auctionedtoorecent.eth`)
    cy.waitUntilTextHasBackgroundColor('Migrate', 'rgba(0, 0, 0, 0)')
    //cy.queryByText('Migrate', { timeout: 1000 }).should('be.disabled')
  })

  it('cannot migrate a domain that is already on the permanent registrar', () => {
    cy.visit(`${ROOT}/name/newname.eth`)
    cy.queryByText('Migrate', { timeout: 50 }).should('not.exist')
  })
})

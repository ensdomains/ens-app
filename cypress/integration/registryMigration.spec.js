const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

const DISABLED_COLOUR = 'rgb(223, 223, 223)'

describe('Migrate a subdomain to new registry', () => {
  it('can visit an unmigrated name and migrate it', () => {
    cy.visit(`${ROOT}/name/sub1.testing.eth`)
    cy.waitUntilHollowInputResolves('Migrate').then(() => {
      cy.getByText('Migrate').click({ force: true })
      cy.queryByText('migrate', { timeout: 50 }).should('not.exist')
    })

    // TODO add tests to check records
  })

  it('can visit an unmigrated name and cannot migrate because parent is unmigrated', () => {
    cy.visit(`${ROOT}/name/a1.sub2.testing.eth`)
    cy.queryByText('You must first migrate the parent domain', {
      timeout: 5000,
      exact: false
    }).should('exist')

    cy.queryByText('Migrate').should('have.css', 'color', DISABLED_COLOUR)
  })

  it('can visit an unmigrated name and cannot set the controller', () => {
    cy.visit(`${ROOT}/name/sub2.testing.eth`)
    cy.queryByText('You must first migrate the parent domain', {
      timeout: 5000,
      exact: false
    }).should('exist')

    cy.queryByTestId('edit-controller').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })
})

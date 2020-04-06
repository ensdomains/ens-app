const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(82, 132, 255)'
const DISABLED_COLOUR = 'rgb(199, 211, 227)'

describe('/address', () => {
  it('contains the list of names owened by the user', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('My Names', { exact: false }).should(
      'have.css',
      'color',
      DISABLED_COLOUR
    )

    cy.getByText('My Names').click({ force: true })
    cy.queryByText('View On Etherscan', { exact: false }).should('exist')
    cy.queryByText('postmigration.eth', { exact: false }).should('exist')
    cy.queryByText('My Names', { exact: false }).should(
      'have.css',
      'color',
      ENABLED_COLOUR
    )
  })

  it('can select a name', () => {
    cy.visit(ROOT)
    cy.getByText('My Names').click({ force: true })
    cy.getByTestId('checkbox-aftermigration.eth').click()
    cy.get('[data-test-id="checkbox-aftermigration.eth"] div').should(
      'have.css',
      'border-top-color',
      ENABLED_COLOUR
    )
  })
})

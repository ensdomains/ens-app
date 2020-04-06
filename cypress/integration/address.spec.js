const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(82, 132, 255)'
const DISABLED_COLOUR = 'rgb(199, 211, 227)'

describe('/address', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
  })
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
    cy.queryByText('View On Etherscan', {
      exact: false,
      timeout: 10000
    }).should('exist')
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
    cy.getByTestId('checkbox-aftermigration.eth', { timeout: 10000 }).click()
    cy.get('[data-testid="checkbox-aftermigration.eth"] div').should(
      'have.css',
      'border-top-color',
      ENABLED_COLOUR
    )
  })

  it('cannot renew if no names selected', () => {
    cy.visit(ROOT)
    cy.getByText('My Names').click({ force: true })
    cy.getByText('Renew', { exact: false }).click()
    cy.queryByText('Renew', { exact: false }).should(
      'have.css',
      'background',
      DISABLED_COLOUR
    )
  })

  it('can select a name and renew', () => {
    cy.visit(ROOT)
    cy.getByText('My Names').click({ force: true })
    cy.getByTestId('checkbox-aftermigration.eth', { timeout: 10000 }).click()
    cy.get('[data-testid="checkbox-aftermigration.eth"] div', {
      timeout: 10000
    }).should('have.css', 'border-top-color', ENABLED_COLOUR)
    cy.getByText('Renew', { exact: false }).click()
    cy.queryByText('Rental', { exact: false }).should('exist')
    cy.getByText('Renew', { exact: true }).click()
    cy.getByText('Confirm', { exact: true }).click()
    const currentYear = new Date().getFullYear()
    cy.queryByText(`${currentYear + 1}`, { exact: false }).should('exist')
  })
})

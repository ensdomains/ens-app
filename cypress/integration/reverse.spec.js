const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(82, 132, 255)'
const DISABLED_COLOUR = 'rgb(199, 211, 227)'

describe('Reverse record', () => {
  //Visit a domain, check the owner, resolver, address, content exists
  it('is set to abittooawesome.eth', () => {
    cy.visit(ROOT)
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
    cy.getByPlaceholderText('Search', { exact: false }).type(
      Cypress.env('ownerAddress')
    )
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Reverse record: Set to abittooawesome.eth', {
      exact: false,
      timeout: 10000
    }).should('exist')
    cy.getByTestId('account', { exact: false, timeout: 10000 }).should(
      'have.text',
      'abittooawesome.eth'
    )
  })
  it('Does not allow reverse switch if forward resolution is not set', () => {
    cy.visit(ROOT)
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
    cy.getByPlaceholderText('Search', { exact: false }).type(
      Cypress.env('ownerAddress')
    )
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.get('button')
      .contains('Search')
      .click()

    cy.scrollTo(0, 500)

    cy.queryByText('Reverse record: Set to abittooawesome.eth', {
      exact: false,
      timeout: 10000
    }).should('exist')
    cy.getByTestId('open-reverse').click({ force: true })
    cy.getByTestId('reverse-input').type('resolver.eth')

    cy.queryByText('Forward resolution must match your account', {
      exact: false,
      timeout: 10000
    }).should('exist')
  })

  //TODO: Add test for setting reverse record
})

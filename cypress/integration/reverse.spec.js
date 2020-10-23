const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Reverse record', () => {
  //Visit a domain, check the owner, resolver, address, content exists
  it('is set to abittooawesome.eth', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type(
      Cypress.env('ownerAddress')
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
    cy.getByPlaceholderText('Search', { exact: false }).type(
      Cypress.env('ownerAddress')
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
})

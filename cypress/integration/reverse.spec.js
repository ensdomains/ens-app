const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Reverse record', () => {
  //Visit a domain, check the owner, resolver, address, content exists
  it('is set to abittooawesome.eth', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('abittooawesome.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Reverse record: Set to abittooawesome.eth', { exact: false }).should('exist')
    cy.getByTestId('account',{exact: false} ).should('have.text', 'abittooawesome.eth')
  })
  it('prompts to change if the logged in user searches the record they own but reverse record is set to something else', ()=>{
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Reverse record: Set to a different name:abittooawesome.eth', { exact: false }).should('exist')
    cy.getByTestId('small-caret').click()
    
    cy.queryByText('resolver.eth', { exact: false }).should('exist')
  })
})

const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Favorites', () => {
  it('can add and remove favourites', () => {
    cy.visit(`${ROOT}/favourites`)
    cy.queryByText('No names have been saved.', { exact: false }).should('exist')
  
    cy.visit(`${NAME_ROOT}/resolver.eth`)
    cy.getByTestId('add-favorite').click()
  
    cy.visit(`${ROOT}/favourites`)
    cy.queryByText('No names have been saved.', { exact: false }).should('not.exist')
    cy.getByTestId('favourites-container').within(container => {
      cy.queryByText('resolver.eth', { exact: false }).should('exist')
    })

    cy.visit(`${NAME_ROOT}/resolver.eth`)
    cy.getByTestId('add-favorite').click()
  
    cy.visit(`${ROOT}/favourites`)
    cy.queryByText('No names have been saved.', { exact: false }).should('exist')
  })
})

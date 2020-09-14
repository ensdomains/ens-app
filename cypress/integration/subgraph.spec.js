const NAME_ROOT = Cypress.env('GRAPH_ROOT')

describe('The graph endpoint', () => {
  it('can be connected', () => {
    cy.visit(`${NAME_ROOT}`)
    cy.queryByText('Welcome to GraphiQL', { exact: false }).should('exist')
  })
})

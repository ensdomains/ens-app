const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Favorites', () => {
  beforeEach(() => {
    cy.visit(`${ROOT}/favourites`)
  })
  it('can visit the favourites page', () => {
    cy.queryByText('No names have been saved.', { exact: false }).should(
      'exist'
    )
  })
  it('can add and remove favourites', () => {
    cy.queryByText('No names have been saved.', { exact: false }).should(
      'exist'
    )

    cy.visit(`${NAME_ROOT}/resolver.eth`, { timeout: 20000 })
    cy.queryByText('Registrant', { timeout: 10000, exact: false }).should(
      'exist'
    )
    cy.wait(3000)
    cy.getByTestId('add-favorite', { timeout: 10000 }).click({ force: true })

    cy.visit(`${ROOT}/favourites`)

    cy.getByTestId('favourites-container').within(container => {
      cy.queryByText('resolver.eth', { exact: false }).should('exist')
      cy.queryByText('Expires', { exact: false }).should('exist')
    })

    cy.queryByText('No names have been saved.', { exact: false }).should(
      'not.exist'
    )
    cy.visit(`${NAME_ROOT}/resolver.eth`, { timeout: 20000 })
    cy.getByTestId('add-favorite', { timeout: 10000 }).click({ force: true })

    cy.visit(`${ROOT}/favourites`)
    cy.queryByText('No names have been saved.', { exact: false }).should(
      'exist'
    )
  })
})

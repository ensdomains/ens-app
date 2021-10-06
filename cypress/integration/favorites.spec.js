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

  it('can click select all and renew all names with expiration including non owned names', () => {
    // Owned by others
    const name = 'otherowner.eth'
    cy.visit(`${NAME_ROOT}/${name}`, { timeout: 20000 })
    cy.queryByText('Registrant', { timeout: 10000, exact: false }).should(
      'exist'
    )
    cy.getByTestId('add-favorite', { timeout: 10000 }).click({ force: true })
    cy.wait(3000)
    cy.visit(`${ROOT}/favourites`)
    cy.get(`[data-testid="expiry-date-${name}"]`, {
      timeout: 10000
    })
      .invoke('text')
      .then(text => {
        const currentYear = parseInt(text.match(/(\d){4}/)[0])
        // Select all
        cy.getByTestId(`checkbox-renewall`, { timeout: 10000 }).click({
          force: true
        })
        cy.getByText('Extend Selected', { exact: false }).click({ force: true })
        cy.queryByText('Registration Period', { exact: false }).should('exist')
        cy.queryByText(
          'Extending the registration of a name you do not own does not give you ownership of it.',
          { exact: false }
        ).should('exist')
        cy.getByText('Extend', { exact: true }).click({ force: true })
        cy.getByText('Confirm', { exact: true }).click({ force: true })
        cy.wait(3000)
        cy.visit(`${ROOT}/favourites`)
        cy.get(`[data-testid="expiry-date-${name}"]`, {
          timeout: 10000
        }).within(() => {
          cy.queryByText(`${currentYear + 1}`, {
            exact: false,
            timeout: 20000
          }).should('exist')
        })
      })
  })
})

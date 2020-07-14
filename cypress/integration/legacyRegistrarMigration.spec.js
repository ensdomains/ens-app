const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Release Deed from Migrated Legacy registrar', () => {
  it('does not see release button if already released', () => {
    cy.visit(`${ROOT}/name/auctioned2.eth`)
    cy.queryByText(
      'Your name was automatically migrated to the new Registrar',
      {
        timeout: 1000,
        exact: false
      }
    ).should('not.exist')
  })

  it('can visit a name and migrate it', () => {
    cy.visit(`${ROOT}/name/auctioned3.eth`)
    cy.queryByText(
      'Your name was automatically migrated to the new Registrar',
      {
        timeout: 5000,
        exact: false
      }
    ).should('exist')

    cy.queryByTestId('enabled-return-button', {
      exact: false,
      timeout: 1000
    }).should('exist')
    cy.getByText('Return').click({ force: true })
    cy.queryByText('Your deposit is now returned.', {
      timeout: 5000,
      exact: false
    }).should('exist')
    cy.queryByText('Return', { timeout: 50 }).should('not.exist')
  })

  it('cannot press return button of name not owned by you', () => {
    cy.visit(`${ROOT}/name/auctionedbysomeoneelse.eth`)
    cy.queryByText(
      'This name was automatically migrated to the new Registrar',
      {
        timeout: 5000,
        exact: false
      }
    ).should('exist')
    cy.queryByTestId('disabled-return-button', {
      exact: false,
      timeout: 1000
    }).should('exist')
  })
})

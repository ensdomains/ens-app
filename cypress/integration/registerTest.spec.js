const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Register', () => {
  it('can not register test domain if already owned', () => {
    cy.visit(`${NAME_ROOT}/example.test/details`)
    cy.queryByText('Transfer', { exact: false, timeout: 10000 }).should('exist')
    cy.queryByText('Not owned yet', { exact: false, timeout: 5000 }).should(
      'not.exist'
    )
    cy.queryByTestId('claim-test', { exact: false, timeout: 5000 }).should(
      'not.exist'
    )
  })

  it('can register test domain', () => {
    const LABEL = 'newname'
    cy.visit(`${NAME_ROOT}/${LABEL}.test/details`)
    cy.queryByText('Not owned', { exact: false, timeout: 10000 }).should(
      'exist'
    )

    cy.getByTestId('claim-test').click({ force: true })
    cy.wait(1000)
    cy.queryByText('Not owned yet', { exact: false, timeout: 1000 }).should(
      'not.exist'
    )
    cy.queryByText('Transfer', { exact: false, timeout: 1000 }).should('exist')
  })
})

const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Register', () => {
  it('can not register non test domain', () => {
    cy.visit(`${NAME_ROOT}/newname.eth`)
    cy.queryByText('Not owned yet', { exact: false, timeout:10000 }).should('exist')
    cy.queryByText('Claim the test domain', { exact: false,  }).should('not.exist')
  })

  it('can not register test domain if already owned', () => {
    cy.visit(`${NAME_ROOT}/example.test`)
    cy.queryByText('Transfer', { exact: false, timeout:10000 }).should('exist')
    cy.queryByText('Not owned yet', { exact: false, timeout:10000 }).should('not.exist')
    cy.queryByText('Claim the test domain', { exact: false,  }).should('not.exist')
  })

  it('can register test domain', () => {
    cy.visit(`${NAME_ROOT}/newname.test`)
    cy.queryByText('Not owned yet', { exact: false, timeout:10000 }).should('exist')

    cy.getByText('Claim the test domain')
      .click()
    cy.wait(1000)
    cy.queryByText('Not owned yet', { exact: false, timeout:10000  }).should('not.exist')
    cy.queryByText('Transfer', { exact: false, timeout:10000 }).should('exist')
  })
})

const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Register', () => {
  //Visit a domain, check the owner, resolver, address, content exists
  it('can register non test domain', () => {
    cy.visit(`${NAME_ROOT}/newname.eth`)
    cy.queryByText('Not owned yet', { exact: false,  }).should('exist')
    cy.queryByText('Claim the test domain', { exact: false,  }).should('not.exist')
  })
  it('can register test domain', () => {
    cy.visit(`${NAME_ROOT}/newname.test`)
    cy.queryByText('Not owned yet', { exact: false,  }).should('exist')

    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.getByTest('Claim the test domain')
      .click()

    cy.queryByText('Not owned yet', { exact: false,  }).should('not.exist')
  })
})

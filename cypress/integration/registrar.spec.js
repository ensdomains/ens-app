const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('PermanentRegistrar', () => {
  it('can visit a name', () => {
    cy.visit(`${ROOT}/name/vitalik.eth`)
  })
})

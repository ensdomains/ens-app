const ROOT = Cypress.env('ROOT')
const ADDRESS = Cypress.env('ownerAddress')

describe(
  'Reverse record',
  {
    retries: {
      runMode: 5
    }
  },
  () => {
    it('is set', () => {
      const url = `${ROOT}/address/${ADDRESS}`
      cy.visit(url)
      cy.queryByText(`everse record: not set`, {
        exact: false,
        timeout: 10000
      }).should('exist')

      cy.getByTestId('account', { exact: false, timeout: 20000 }).should(
        'have.text',
        `${ADDRESS.slice(0, 10)}...`
      )
      cy.getByText('Select your ENS name', { exact: false })
        .click({ force: true })
        .get('#react-select-2-option-1', { timeout: 10000 })
        .invoke('text')
        .then(name => {
          console.log('***TEST', { name })
          cy.get('#react-select-2-option-1', { timeout: 10000 })
            .click({ force: true })
            .getByText('Save', { timeout: 5000 })
            .click({ force: true })

          cy.queryByText(`Reverse record: Set to`, {
            exact: false,
            timeout: 10000
          }).should('exist')
          cy.visit(url)
          cy.wait(5000)
          cy.getByTestId('account', { exact: false, timeout: 10000 }).should(
            'have.text',
            name
          )
        })
    })
  }
)

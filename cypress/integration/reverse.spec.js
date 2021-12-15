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
      cy.wait(5000)

      cy.queryByText(`Primary ENS Name (reverse record)`, {
        exact: false,
        timeout: 10000
      })

      cy.getByTestId('account', { exact: false, timeout: 20000 }).should(
        'have.text',
        `${ADDRESS.slice(0, 5)}...${ADDRESS.slice(-4)}`
      )

      cy.getByText('Select one of your ENS names', { exact: false }).click({
        force: true
      })

      cy.getByText('sub1.otherowner.eth', { exact: true }).click({
        force: true
      })

      cy.getByText('Save', { timeout: 5000 }).click({ force: true })

      cy.queryByText(`Primary ENS Name (reverse record): sub1.otherowner.eth`, {
        exact: false,
        timeout: 10000
      }).should('exist')

      cy.visit(url)
      cy.wait(5000)

      cy.getByTestId('account', { exact: false, timeout: 10000 }).should(
        'have.text',
        'sub1.otherowner.eth'
      )
    })
  }
)

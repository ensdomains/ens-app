const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe(
  'Reverse record',
  {
    retries: {
      runMode: 5
    }
  },
  () => {
    it('Display reverse record not set for non owner', () => {
      cy.visit(`${ROOT}/name/otherowner.eth`)
      cy.getByTestId('details-value-registrant').within(container => {
        cy.get('a').click({ force: true })
      })
      cy.queryByTestId('readonly-reverse-record-not-set', {
        exact: false
      }).should('exist')
    })

    //TODO: Add test for setting reverse record
  }
)

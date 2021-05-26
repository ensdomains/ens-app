const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ADDRESS = Cypress.env('ownerAddress')

function confirmRecordUpdate() {
  cy.getByTestId('action').click({ force: true })
  cy.getByTestId('send-transaction').click({
    force: true
  })
  cy.wait(1000)
}

function refreshAndCheckText(url, textOrArrayOfText) {
  cy.visit(url)
  if (typeof textOrArrayOfText === 'string') {
    cy.queryByText(textOrArrayOfText, { timeout: 20000 }).should('exist')
  } else {
    textOrArrayOfText.forEach(text =>
      cy.queryByText(text, { timeout: 20000 }).should('exist')
    )
  }
}

describe(
  'Reverse record',
  {
    retries: {
      runMode: 5
    }
  },
  () => {
    it('is set to abittooawesome2.eth', () => {
      const name = 'abittooawesome2.eth'
      const url = `${NAME_ROOT}/${name}`
      cy.visit(url)

      cy.getByTestId('account', { exact: false, timeout: 10000 }).should(
        'not.have.text',
        name
      )

      cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
        cy.getByText('Add/Edit Record').click({ force: true })
        cy.wait(2000)
        // Address
        cy.getByTestId('ETH-record-input')
          .clear({ force: true })
          .type(ADDRESS, { force: true })
      })

      confirmRecordUpdate()
      refreshAndCheckText(url, [ADDRESS])

      cy.getByText('My Account').click({ force: true })

      cy.wait(1500)
      cy.queryByTestId('editable-reverse-record-set', { exact: false }).should(
        'exist'
      )
      cy.getByTestId('account', { exact: false, timeout: 10000 }).should(
        'not.have.text',
        name
      )
      cy.getByText('Select your ENS name', { exact: false })
        .click({ force: true })
        .get('#react-select-2-option-1', { timeout: 10000 })
        .contains(name)
        .click({ force: true })
      cy.queryByText(name, { exact: false })
        .click({ force: true })
        .getByText('Save', { timeout: 5000 })
        .click({ force: true })

      cy.queryByText(`Reverse record: Set to ${name}`, {
        exact: false,
        timeout: 10000
      }).should('exist')
      cy.getByText('My Account').click({ force: true })
      cy.getByTestId('account', { exact: false, timeout: 10000 }).should(
        'not.have.text',
        name
      )
    })
  }
)

const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(82, 132, 255)'
const DISABLED_COLOUR = 'rgb(199, 211, 227)'

describe('/address', () => {
  it('does not contain unnormalised names', () => {
    cy.visit(ROOT)
    cy.getByText('My Account').click({ force: true })
    cy.queryByText('InvalidName.eth', { exact: false, timeout: 5000 }).should(
      'not.exist'
    )
  })

  it('contains the list of names owened by the user', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.wait(1000)
    cy.get('button')
      .contains('Search')
      .click({ force: true })

    cy.getByTestId('sitenav').within(container => {
      cy.queryByText('My Account', { container, exact: false }).should(
        'have.css',
        'color',
        DISABLED_COLOUR
      )
    })

    cy.getByText('My Account').click({ force: true })
    cy.queryByText('View On Pulsechain', {
      exact: false,
      timeout: 10000
    }).should('exist')
    cy.queryByText('newname.eth', { exact: false }).should('exist')
    cy.queryByText('Expires', { exact: false }).should('exist')
  })

  it('can select a name', () => {
    cy.visit(ROOT)
    cy.getByText('My Account').click({ force: true })
    // force:false will click the link under the element
    cy.getByTestId('checkbox-newname.eth', { timeout: 10000 }).click({
      force: true
    })
    cy.get('[data-testid="checkbox-newname.eth"] div').should(
      'have.css',
      'border-top-color',
      ENABLED_COLOUR
    )
  })

  it('cannot renew if no names selected', () => {
    cy.visit(ROOT)
    cy.getByText('My Account').click({ force: true })
    cy.getByText('Extend', { exact: false, timeout: 10000 }).click({
      force: true
    })
    cy.queryByText('Extend', { exact: false }).should(
      'have.css',
      'background-color',
      'rgb(223, 223, 223)'
    )
  })

  it('can click select all and renew all', () => {
    const name = `newname.eth`
    cy.visit(ROOT)
    cy.getByText('My Account').click({ force: true })
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
        cy.get(`[data-testid="checkbox-${name}"] div`, {
          timeout: 10000
        }).should('have.css', 'border-top-color', ENABLED_COLOUR)
        cy.getByText('Extend Selected', { exact: false }).click({ force: true })
        cy.queryByText('Registration Period', { exact: false }).should('exist')
        cy.getByText('Extend', { exact: false }).click({ force: true })
        cy.getByText('Confirm', { exact: true }).click({ force: true })
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

  it('can select a single name and renew', () => {
    const name = `newname.eth`
    cy.visit(ROOT)
    cy.getByText('My Account').click({ force: true })
    cy.get(`[data-testid="expiry-date-${name}"]`, {
      timeout: 10000
    })
      .invoke('text')
      .then(text => {
        const currentYear = parseInt(text.match(/(\d){4}/)[0])
        cy.getByTestId(`checkbox-${name}`, { timeout: 10000 }).click({
          force: true
        })
        cy.get(`[data-testid="checkbox-${name}"] div`, {
          timeout: 10000
        }).should('have.css', 'border-top-color', ENABLED_COLOUR)
        cy.getByText('Extend Selected', { exact: false }).click()
        cy.queryByText('Registration Period', { exact: false }).should('exist')
        cy.getByText('Extend', { exact: false }).click()
        cy.getByText('Confirm', { exact: true }).click()
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

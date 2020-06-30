const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(82, 132, 255)'
const DISABLED_COLOUR = 'rgb(199, 211, 227)'

describe('/address', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
  })
  it('contains the list of names owened by the user', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.getByTestId('sitenav').within(container => {
      cy.queryByText('My Names', { container, exact: false }).should(
        'have.css',
        'color',
        DISABLED_COLOUR
      )
    })

    cy.getByText('My Names').click({ force: true })
    cy.queryByText('View On Etherscan', {
      exact: false,
      timeout: 10000
    }).should('exist')
    cy.queryByText('newname.eth', { exact: false }).should('exist')
    cy.queryByText('Expires', { exact: false }).should('exist')
    cy.getByTestId('sitenav').within(container => {
      cy.queryByText('My Names', { container, exact: false }).should(
        'have.css',
        'color',
        ENABLED_COLOUR
      )
    })
  })

  it('can select a name', () => {
    cy.visit(ROOT)
    cy.getByText('My Names').click({ force: true })
    cy.getByTestId('checkbox-newname.eth', { timeout: 10000 }).click()
    cy.get('[data-testid="checkbox-newname.eth"] div').should(
      'have.css',
      'border-top-color',
      ENABLED_COLOUR
    )
  })

  it('cannot renew if no names selected', () => {
    cy.visit(ROOT)
    cy.getByText('My Names').click({ force: true })
    cy.getByText('Renew', { exact: false, timeout: 10000 }).click()
    cy.queryByText('Renew', { exact: false }).should(
      'have.css',
      'background-color',
      'rgb(223, 223, 223)'
    )
  })

  it.only('can click select all and renew all', () => {
    const names = [`resolver.eth`, `newname.eth`]
    cy.visit(ROOT)
    cy.getByText('My Names').click({ force: true })
    cy.getByTestId(`checkbox-renewall`, { timeout: 10000 }).click()
    names.forEach(name => {
      cy.get(`[data-testid="checkbox-${name}"] div`, {
        timeout: 10000
      }).should('have.css', 'border-top-color', ENABLED_COLOUR)
    })

    cy.getByText('Expires ', { exact: false })
      .invoke('text')
      .then(text => {
        // Current year is more likely a few years ahead of actual Date, so have to fetch from the page.
        const currentYear = parseInt(text.match(/(\d){4}/)[0])
        cy.getByText('Renew', { exact: false }).click()
        cy.wait(5000)
        cy.queryByText('Registration Period', { exact: false }).should('exist')
        cy.wait(5000)
        cy.getByText('Renew', { exact: true }).click()
        cy.wait(5000)
        cy.getByText('Confirm', { exact: true }).click()
        cy.wait(5000)
        cy.getByText('My Names').click({ force: true })
        cy.wait(5000)
        // Disable temporarily
        // names.forEach(name => {
        //   cy.get(`[data-testid="${name}"]`, {
        //     timeout: 10000
        //   }).within(() => {
        //     cy.queryByText(`${currentYear + 1}`, {
        //       exact: false,
        //       timeout: 10000
        //     }).should('exist')
        //   })
        // })
        cy.queryByText(`${currentYear + 1}`, {
          exact: false,
          timeout: 10000
        }).should('exist')
        cy.wait(5000)
      })
  })

  it('can select a single name and renew', () => {
    const name = `newname.eth`
    cy.visit(ROOT)
    cy.getByText('My Names').click({ force: true })
    cy.getByTestId(`checkbox-${name}`, { timeout: 10000 }).click()
    cy.get(`[data-testid="checkbox-${name}"] div`, {
      timeout: 10000
    }).should('have.css', 'border-top-color', ENABLED_COLOUR)
    cy.getByText('Renew', { exact: false }).click()
    cy.queryByText('Registration Period', { exact: false }).should('exist')
    cy.getByText('Renew', { exact: true }).click()
    cy.getByText('Confirm', { exact: true }).click()
    const currentYear = new Date().getFullYear()

    cy.get(`[data-testid="${name}"]`, {
      timeout: 10000
    }).within(() => {
      cy.queryByText(`${currentYear + 2}`, {
        exact: false,
        timeout: 20000
      }).should('exist')
    })
  })
})

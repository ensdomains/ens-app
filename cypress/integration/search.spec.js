const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(82, 132, 255)'
const DISABLED_COLOUR = 'rgb(199, 211, 227)'

describe('Search', () => {
  it('can list a domain', () => {
    cy.visit(ROOT)
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
    cy.getByPlaceholderText('Search', { timeout: 10000, exact: false }).type(
      'resolver'
    )
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.get('button')
      .contains('Search')
      .click()
    cy.getByTestId('domain-container').within(container => {
      cy.queryByText('resolver.eth', { timeout: 10000, exact: false }).should(
        'exist'
      )
      cy.queryByText('Expires', { timeout: 10000, exact: false }).should(
        'exist'
      )
    })
  })

  it('can search for a domain', () => {
    cy.visit(ROOT)
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
    cy.getByPlaceholderText('Search', { timeout: 10000, exact: false }).type(
      'resolver.eth'
    )
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.get('button')
      .contains('Search')
      .click()

    cy.getByTestId('details-value-registrant', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
    cy.getByTestId('details-value-controller', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
    cy.getByTestId('details-value-resolver', { exact: false }).should(
      'have.text',
      Cypress.env('resolverAddress')
    )
  })

  it('can not search names with invalid format', () => {
    cy.visit(ROOT)
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
    cy.getByPlaceholderText('Search', { timeout: 10000, exact: false }).type(
      'abc defg'
    )
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Domain malformed. abc defg is not a valid domain.', {
      timeout: 10000,
      exact: false
    }).should('exist')
    cy.queryByText('Owner', { exact: false, timeout: 1 }).should('not.exist')
    cy.queryByText('Resolver', { exact: false, timeout: 1 }).should('not.exist')
  })

  it('cannot directly search too short name', () => {
    cy.visit(`${ROOT}/search/ab`)
    cy.queryByText('Name is too short', {
      timeout: 10000,
      exact: false
    }).should('exist')
  })

  it('cannot register malformated name', () => {
    cy.visit(`${ROOT}/search/ab eth`)
    cy.queryByText('Domain malformed. ab eth is not a valid domain', {
      timeout: 10000,
      exact: false
    }).should('exist')
  })

  it('cannot register unsupported tld', () => {
    cy.visit(`${ROOT}/search/ab.cdef`)
    cy.queryByText('is not currently a supported TLD', {
      timeout: 10000,
      exact: false
    }).should('exist')
  })

  it('can see the list of Names if no TLDS are specified', () => {
    cy.visit(ROOT)
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
    cy.getByPlaceholderText('Search', { timeout: 10000, exact: false }).type(
      'notldispsecified'
    )
    cy.queryByText('Search', { exact: false }).should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Names', { exact: false }).should('exist')
    cy.queryByText('notldispsecified.eth', { exact: false }).should('exist')
  })
})

const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Search', () => {
  it('can list a domain', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver')
    cy.wait(500)
    cy.get('button')
      .contains('Search')
      .click()

    cy.getByTestId('domain-container').within(container => {
      cy.queryByText('resolver.eth', { exact: false }).should('exist')
      cy.queryByText('Expires', { exact: false }).should('exist')
    })
  })

  //Visit a domain, check the owner, resolver, address, content exists
  it('can search for a domain', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.wait(500)
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('registrant', { exact: false }).should('exist')
    cy.queryByText('controller', { exact: false }).should('exist')
    cy.queryByText('resolver', { exact: false }).should('exist')
  })

  it('can search for a domain', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.wait(500)
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
    cy.getByPlaceholderText('Search', { exact: false }).type('abc defg')
    cy.wait(500)
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Domain malformed. abc defg is not a valid domain.', {
      exact: false
    }).should('exist')
    cy.queryByText('Owner', { exact: false, timeout: 1 }).should('not.exist')
    cy.queryByText('Resolver', { exact: false, timeout: 1 }).should('not.exist')
  })

  it('cannot directly search too short name', () => {
    cy.visit(`${ROOT}/search/ab`)
    cy.queryByText('Name is too short', { exact: false }).should('exist')
  })

  it('cannot register malformated name', () => {
    cy.visit(`${ROOT}/search/ab eth`)
    cy.queryByText('Domain malformed. ab eth is not a valid domain', {
      exact: false
    }).should('exist')
  })

  it('cannot register unsupported tld', () => {
    cy.visit(`${ROOT}/search/ab.cdef`)
    cy.queryByText('is not currently a supported TLD', { exact: false }).should(
      'exist'
    )
  })

  it('can see the list of Names if no TLDS are specified', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('notldispsecified')
    cy.wait(500)
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Names', { exact: false }).should('exist')
    cy.queryByText('notldispsecified.eth', { exact: false }).should('exist')
  })
})

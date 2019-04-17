const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Search', () => {
  //Visit a domain, check the owner, resolver, address, content exists
  it('can search for a domain', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('owner', { exact: false }).should('exist')
    cy.queryByText('resolver', { exact: false }).should('exist')
  })

  it('can search for a domain', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.getByTestId('details-value-owner', { exact: false }).should(
      'have.text',
      Cypress.env('ownerAddress')
    )
    cy.getByTestId('details-value-resolver', { exact: false }).should(
      'have.text',
      Cypress.env('resolverAddress')
    )
  })

  it('can not search short name', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('short.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Names must be at least 7 characters long', {
      exact: false
    }).should('exist')
    cy.queryByText('Owner', { exact: false, timeout: 1 }).should('not.exist')
    cy.queryByText('Resolver', { exact: false, timeout: 1 }).should('not.exist')
  })

  it('can not search names with invalid format', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('abc defg')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Domain malformed. abc defg is not a valid domain.', {
      exact: false
    }).should('exist')
    cy.queryByText('Owner', { exact: false, timeout: 1 }).should('not.exist')
    cy.queryByText('Resolver', { exact: false, timeout: 1 }).should('not.exist')
  })

  it('can search name with no owners', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type(
      'nonexistingdomain.eth'
    )
    cy.get('button')
      .contains('Search')
      .click()

    cy.getByTestId('details-value-owner', { exact: false }).should(
      'have.text',
      'Not owned yet'
    )
    cy.getByTestId('details-value-resolver', { exact: false }).should(
      'have.text',
      'No Resolver set'
    )
  })

  it('can see the list of Top level domains and subdomains if no TLDS are specified', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('notldispsecified')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('Top Level Domains', { exact: false }).should('exist')
    cy.queryByText('notldispsecified.eth', { exact: false }).should('exist')
    cy.queryByText('Subdomains', { exact: false }).should('exist')
  })
})

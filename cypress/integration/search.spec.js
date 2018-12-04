const ROOT = 'http://localhost:3000'
const NAME_ROOT = `${ROOT}/name`

describe('Visit a domain', () => {
  //Visit a domain, check the owner, resolver, address, content exists
  it('Visits the Kitchen Sink', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('owner')
  })
})

describe('Name detail view', () => {
  //Visit a domain

  it('can transfer ownership', () => {
    cy.visit(`${NAME_ROOT}/awesome.eth`)
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can change the resolver', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can add use add record to add an address', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can add use add record to add a content hash', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can change the resolver to the public resolver', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can change the address', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can change the content hash', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })
})

describe('Search results', () => {
  //Visit a domain

  it('can search for a domain', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can search for a subdomain with fewer letters, but shows an error for TLDs', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can search for a subdomain with fewer letters, but shows an error for TLDs', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })
})
